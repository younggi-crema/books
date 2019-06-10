# Chap 4. Querying

## Introduction to find
* `find`
  - first argument: query criteria
  ```js
  > db.user.find({"username" : "joe", "age" : 27})
  ```

### Specifiying Which Keys to Return
* `find`
  - second argument: specifying the key
  ```js
  // username과 email key, value만 리턴
  > db.user.find({}, {"username" : 1, "email" : 1})
  // username을 제외
  > db.user.find({}, {"username" : 1})
  ```

### Limitations
* query의 value는 constant이여야 함

## Query Criteria

### Query Conditionals
* comparison operators
  - `<` : `$lt`
  - `<=` : `$lte`
  - `>` : `$gt`
  - `>=` : `$gte`
  - `!=` : `$ne`
  ```js
  > db.users.find({"age" : {"$gte" : 18, "$lte" : 30}})
  ```

### OR Queries
* OR query
  - `$in`, `$nin`
  - `$or`: first argument에서 최대한 많이 matching 될수록 효과적임
  ```js
  > db.users.find({"user_id" : {"$in" : [12345, "joe"]}})
  ```
  ```js
  > db.raffle.find({"$or" : [{"ticket_no" : 725}, {"winner" : true}]})
  ```

#### $not
* `$not`: metaconditional (모든 다른 criteria 맨 앞에 적용 가능함)
  ```js
  > db.users.find({"id_num" : {"$not" : {"$mod" : [5, 1]}}})
  ```

#### Conditional Semantics
* meta-operators: `$and`, `$or`, `$nor`
  ```js
  > db.users.find({"$and" : [{"x" : {"$lt" : 1}}, {"x" : 4}]})
  ```

### Type-Specific Queries

#### null
* `null`
  - `null`인 것을 찾을 수 있으나, 존재 하지 않는 것도 true로 판단하게 됨
  ```js
  > db.c.find({"y" : null})
  ```
  - `null`이 값이고, 존재하는 것만 조회
  ```js
  > db.c.find({"z" : {"$in" : [null], "$exists" : true}})
  ```

#### Regular Expressions
* regular expression (PCRE Perl Compatible Regular Expression))
  ```js
  > db.users.find({"name" : /joe/i})
  ```
* Index는 case-insensitive 한 search에는 효과가 없음
  - 검색할 대상은 모두 소문자등으로 통일 하는 것이 효과적임

#### Querying Arrays
* `$all`: match more than one elements
  - ```{fruit : {$all : ['apple']}}```, ```{fruit : 'apple'}```
  ```js
  > db.food.find({fruit : {$all : ["apple", "banana"]}})
  ```
* key.index (0-indexed)
  ```js
  > db.food.find({"fruit.2" : "peach"})
  ```
* `$size`: 주어진 개수 만큼의 query 결과를 리턴
  ```js
  > db.food.find({"fruit" : {"size" : 3}})
  ```
  - 다른 $ 조건과 함께 사용할 수 없으므로, 사용하려면 별도의 size를 값을 추가하여 사용
  ```js
  > db.food.update(criteria, {"$push" : {"fruit" : "strawberry"}, "$inc" : {"size" : 1}})
  > db.food.find({"size" : {"$gt" : 3}})
  ```
* `$slice`
  - 10 comments
  ```js
  > db.blog.posts.findOne(criteria, {"comments" : {"$slice" : 10}})
  > db.blog.posts.findOne(criteria, {"comments" : {"$slice" : [23, 10]}})
  ```
* Returning a matching array element
  - `$` 어떤 것이든 matching 하는 것
  ```js
  > db.blog.posts.find({"comments.name" : "bob"}, {"comments.$" : 1})
  ```
* Array and range query interactions
  - array value에 range query를 사용하면 부정확함
  ```js
  > db.test.find({"x" : {"$gt" : 10, "$lt" : 20}})
  ```
  - 따라서 array를 조건 검색할 때 `$elemMatch`를 사용
  ```js
  > db.test.find({"x" : {"$elemMatch" : {"$gt" : 10, "$lt" : 20}}})
  ```
#### Querying on Embedded Documents
* 일반 query는 embedded key를 검색하지 않음
* query for embedded keys: `.` notation
  ```js
  > db.people.find({"name.first" : "Joe", "name.last" : "Schmoe"})
  ```
* conditional
  ```js
  > db.blog.find({"comments" : {"$elemMatch" : {"author" : "joe", "score" : {"$gte" : 5}}}})
  ```

#### $where Queries
* `$where`: javascript 구문 사용, 보안에 취약할 수 있으므로, 제한된 쿼리만 허용
  - function이 true일 경우 값을 리턴함
  ```js
  > db.foo.find({"$where" : function () {
    for (var current in this) {
      for (var other in this) {
        if (current != other && this[current] == this[other]) {
          return true;
        }
      }
    }
  }});
  ```

#### Server-Side Scripting
* javascript를 서버에서 실행 할 경우 security 주의
  - `--noscripting` 옵션 사용 시 javascript 실행 방지

#### Cursors
* create cursor
  ```js
  > var cursor = db.collection.find()
  > while (cursor.hasNext()) {
    obj = cursor.next();
    // do stuff
  }
  ```
  ```js
  > var cursor = db.people.find();
  > cursor.forEach(function(x) {
    print(x.name)
  });
  ```
* `find`: 바로 실행되지 않고, query option이 모두 추가 된 후 실행
  ```js
  > var cursor = db.foo.find().sort({"x" : 1}).limit(1).skip(10)
  > cursor.hasNext() // 이때 query 실행
  ```
* `next`시 한번에 100 개 or 4MB 의 결과를 가져옴

#### Limits, Skips, and Sorts
* `limits`
  ```js
  > db.c.find().limit(3)
  ```
* `skip`
  ```js
  > db.c.find().skip(3)
  ```
* `sort`
  ```js
  > db.c.find().sort({username : 1, age : -1})
  ```
* Comparison order
  1. Minimum value
  2. null
  3. Numbers
  4. Strings
  5. Object/document
  6. Array
  7. Binary data
  8. Object ID
  9. Boolean
  10. Date
  11. Timestamp
  12. Regular expression
  13. Maximum value

#### Avoiding Large Skips
* `skip`을 큰 결과에 사용할 경우 느려질 수 있음
* Paginating results without skip
* Finding a random document

#### Advanced Query Options
* two types of queries: `wrapped` and `plain`
  - `plain`: `var cursor = db.foo.find({"foo" : "bar"})`
  - `wrapped`: `{"$query" : {"foo" : "bar"}, $orderby" : {"x" : 1}}`
#### Getting Consistent Results
* 계속해서 update하는 query를 실행할 경우 document size가 커져 해당 위치에 들어갈 공간이 없을 경우 맨 뒤로 위치하게 되어, `cursor`로 탐색할 경우 반복해서 동일한 document를 가져오게 되는 문제가 발생할 수 있음
  - 이 문제를 해결하기 위해 `snapshot`을 이용
  ```js
  > do.foo.find().snapshot()
  ```

#### Immortal Cursors
* cursor는 client에서 사용 후 종료되거나, timeout(10min) 시 종료됨
  - cursor's timeout을 turn off 할 경우 계속 남아 있을 수 있으므로 주의함

### Database Commands
* `drop`
  ```js
  > db.runCommand({"drop" : "test"});
  > db.test.drop()
  ```

#### How Commands Work
* database command return value
  - `1`: ok
  - `0`: failed
