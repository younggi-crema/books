# Chap 5. Indexing

### Explan
* Generate data
```js
for (i=0; i<1000000; i++) {
  db.users.insert(
    {
      "i": i,
      "username" : "user"+i,
      "age" : Math.floor(Math.random()*120),
      "created": new Date()
    }
  );
}
```

* `explain()`: 책과 다르게 `queryPlanner` 결과가 나옴
```js
db.users.find({username: "user101"}).explain()
db.users.find({username: "user101"}).limit(1).explain()
```
* create index to username field
```js
db.users.ensureIndex({"username" : 1})

db.currentOp()
```

* index limit
  - 64 indexes per collection

## Compound Indexes
* compound index: `age`, `username` index for sorting
  - multiple sort directions, multiple keys in the criteria
```js
db.users.find().sort({"age":1, "username": 1})
db.users.ensureIndex({"age":1, "username": 1})
db.users.find({"age": 21}).sort({"username": -1})
db.users.find({"age": {"$gte": 21, "$lte": 30}})

// age만 index를 타기 때문에 username은 결과를 리턴하기 전에 sort하므로 위의 쿼리와 달리 비효율적임
// range 사용 후 뒤에는 index를 사용하지 않으므로 비효율적일 수 있음
// result가 32MB 넘는 데이터를 sorting 하려고 하면 에러 발생
db.users.find({"age": {"$gte": 21, "$lte": 30}}).sort({"username": 1})
db.users.find({"age": {"$gte": 21, "$lte": 30}}).sort({"username": 1}).explain()
```
* 특정 index를 사용하도록 강제하기: `hint`
```js
db.users.find({"age": {"$gte": 21, "$lte": 30}})
  .sort({"username": 1}),
  .hint({"usernane": 1, "age": 1})
  .explain()
```
  - `limit`을 할 경우 새로운 방식으로 query가 실행됨
```js
db.users.find({"age": {"$gte": 21, "$lte": 30}})
  .sort({"username": 1}),
  .limit(1000)
  .hint({"usernane": 1, "age": 1})
  .explain()
```
  - `right-balanced index`
    - `_id`

## Using Compound Indexes

### Choosing key directions
* index는 ascending으로 만들어졌으나, sort on two criteria 일 경우 index key를 서로 다른 direction으로 만들 수 있음
  - 필요한 방향별로 index를 각각 만드는 것이 좋음
```js
// 하나의 index로 같이 사용 가능 (방향이 정반대일 경우)
{"age": 1, "username": -1}
{"age": -1, "username": 1}
```

### Using coverted indexes
* index내에 조회하는 field가 있어서, index만 조회하고, document를 조회할 필요가 없는 경우
* `covering`: query에서 조회하는 field가 index로 모두 cover 되는 경우
  - document를 조회하는 대신 `coverted index`를 사용하게 됨
  - index를 지정하여 쿼리를 실행했을때 `_id`가 리턴되지 않는 경우 index만 사용하게 되는 경우임

### Implicit indexes
* index 하나가 여러가지 index 역할을 할 수 있음
  - 색인: `{"age": 1, "username": 1}`
  - age는 sorting 되어 있기 때문에 `{"age"": 1}`의 index 역할도 가능함
* Generalize
  - `N` keys 가 있는 경우 index field 순서대로의 index를 사용할 수 있음

## How $-Operators Use Indexes

### Inefficient operators
* `$where`를 이용한 `{"$exists": true}`의 경우 index를 사용하나, null 인 경우와 exists 하지 않는 경우 모두 저장하므로 비효율적임
* `$ne` negative는 일반적으로 비효율적임
  - index entries를 모두 검색하게 됨
  ```js
  db.example.find({"i": {"$ne": 3}}).explain()
  ```
* `$not`은 index를 사용하나, 어떻게 사용하는지는 모름
  - `$nin`과 동일하게 table scan을 하게 됨

### Ranges
* range를 사용할 경우 range query를 마지막에 사용할 수 있도록 한다.
  - first exact match: `"x": "foo"` (먼저 exact match로 data를 줄임)
  - second range" `"y": {"$gt": 3, "$lt": 5})`

### OR queries
* `$or`은 각각의 clause 별로 index를 사용함
  - 따라서 query가 각각 실행되게 되므로 비효울적임
  - 가능하면 `$in`을 사용하는 것이 더 좋음

## Indexing Objects and Arrays
* document의 nested fields와 array에도 index를 생성 가능

### Indexing embedded docs
* `loc.city`와 같은 embedded docs의 index를 만들어 빠르게 검색 가능

### Indexing arrays
* array의 entry 각각에 대해서 index를 만들어야 함
* array의 only one field만 index가능

### Multikey index implementation
* array field가 index되면 multikey index가 됨
  - 한번 multikey가 되면 해제할 수 없음
  - multikey index는 non-multikey index보다 느리다

## Index Cardinality
* Cardinality: collection내에서 field의 데이터를 얼마나 많이 distinct 할 수 있는 지 정도
  - `age` 보다 `email`이 cardinality가 높음

## Using explain() and hint()
* `explain()`: slow query 진단에 사용
  - indexed, non-indexed
* `hint()`: 특정 index를 사용하도록 지정

## The Query Optimizer
* query 실행 방식
  - 정확한 index가 있을 경우 index 사용
  - 그렇지 않을 경우 여러 가능한 query를 동시에 돌린 후 winner를 정해서 query를 cache하고 최종 실행 함 (every 1,000 query 별로 winner를 다시 계산함)

## When Not to Index
* index를 두번 lookup 하는 것 보다 table scan 한번이 더 빠름
  - collection의 데이터 30%보다 많은 양을 리턴하는 경우 어떤 것이 더 빠른지 확인할 필요가 있음
* hint `{"$natural": 1}`: table scan을 강제함

## Types of Indexes

### Unique Indexes
* 각각의 value가 한번씩만 나온다고 하는 경우
* 중복되는 value가 없다는 것을 확실히 하기 위해 unique index를 설정
  - unique constraint를 설정하는 것이 더 효율적임
* document가 null일 경우도 index 되므로 주의
* 어떤 경우 index bucket size를 넘는 경우 색인되지 않아 index로는 찾아지지 않는 value가 존재하게 될 수 도 있음
  - 모든 field는 1024 byte 보다 작아야 한
```js
db.users.ensureIndex({"username": 1}, {"unique": true})
```

#### Compound unique indexes
* index에 설정한 모든 field가 다른 값이야 함

#### Dropping duplicates
*
