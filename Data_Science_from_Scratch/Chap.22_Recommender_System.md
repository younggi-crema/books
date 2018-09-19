# Chapter 22. Recommender Systems

## Intro
* Recommendation: common data problem
* Problem: 현재의 interests를 기반으로 새로운 interests를 추천(recommend)
* users_interests (15 users)
```py
users_interests = [
    ["Hadoop", "Big Data", "HBase", "Java", "Spark", "Storm", "Cassandra"],
    ["NoSQL", "MongoDB", "Cassandra", "HBase", "Postgres"],
    ["Python", "scikit-learn", "scipy", "numpy", "statsmodels", "pandas"],
    ["R", "Python", "statistics", "regression", "probability"],
    ["machine learning", "regression", "decision trees", "libsvm"],
    ["Python", "R", "Java", "C++", "Haskell", "programming languages"],
    ["statistics", "probability", "mathematics", "theory"],
    ["machine learning", "scikit-learn", "Mahout", "neural networks"],
    ["neural networks", "deep learning", "Big Data", "artificial intelligence"],
    ["Hadoop", "Java", "MapReduce", "Big Data"],
    ["statistics", "R", "statsmodels"],
    ["C++", "deep learning", "artificial intelligence", "probability"],
    ["pandas", "R", "Python"],
    ["databases", "HBase", "Postgres", "MySQL", "MongoDB"],
    ["libsvm", "regression", "support vector machines"]
]
```

## Manual Curation
* 한정된 users와 interests로 recommendation은 가능하나, scale 하기 어렵고, personal knowledge와 imagination에 의존하게 됨

## Recommending What's Popular
* What's Popular: data중 공통적으로 가장 많은 것
* Recommendation: Popular 중 user가 interest하지 않은 것 추천
* 문제점: Popular하다고 해서 sales point가 될 수 없음

## User-Based Collaborative Filtering
* 유사한(similar)한 interests를 가지고 있는 **사람**을 찾음
  - 두 users가 유사한지 measure하는 방법
  - 사람은 타입이 있다는 전제
* *cosine similarity*: vector v, w 사이의 *angle*
  - v, w가 같은 방향일 경우 1, 반대 방향일 경우 -1, 수직 일때 0
  - 0, 1 값 내로 이루어진 vector를 만들어줌
  ```py
  def cosine_similarity(v, w):
    return dot(v, w) / math.sqrt(dot(v, v) * dot(w, w))
  ```
* Process
  1. unique_interests 만들기: 전체 interests의 list
  2. 각 user의 interest vector (0, 1)로 이루어진 만들기
  3. matrix of user interests 만들기
    - user_interest_matrix[i][j] = 1 (user i, interest j)
  ```py
  user_interest_matrix = map(make_user_interest_vector, users_interests)
  ```
  4. user_interest_matrix를 각각 순회하면서 cosine_similarity를 구하기
    - user_similarities[i][j]: user i, j 사의 similarity
  5. most_similar_users_to: 가장 유사한 user 찾기
    - 같은 user가 아니고, zero similarity를 가지지 않는 user를 similarity가 큰 것부터 sort
    - `most_similar_users_to(0)`
    ```
    [(9, 0.566946..)
     (1, 0.33..)
     (8, 0.18...)]
    ```
  6. user 기반의 suggestion
    - 앞에서 구한 가장 가장 유사한 user의 interest 중 user 자신이 가지지 않은 interests를 추천
    - `user_based_suggestions`
* 단점
  - item의 수가 매우 클 경우 잘 맞지 않음
    - Chap.12 -- in large-dimentional vector spaces most vectors are very far apart (and therefore point in very different directions)
  - Amazon과 같이 수많은 item이 있는 경우 적용하기 여러움

## Item-Based Collaborative Filtering
* **interests** 간의 유사성(similarities)을 직접 계산
  - 현재 interests와 다른 interestes의 유사성을 aggregate 하는 방법으로 추천
* Process
  1. transpose our user-interest matrix (각 interests 별로 어떤 user가 있는지 알수 있는 matrix)
    - rows: interests, columns: users
    - interests_user_matrix[interests][users]
    - user가 interests가 있을 경우 1, 없을 경우 0
    ```
              users
    interests  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
    Big Data  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0] <- user_vector
    ...
    ```
  2. cosine similarity
    - users가 topics에 interests가 있을 경우 similarity는 1
    - users가 topics에 interests가 없을 경우 similarity는 0
    - `interest_similarities`를 구함
  3. find the interests most similar to Big Data (interest_id: 0)
    - 앞에서 계산한 `interst_similarities`로 부터 다른 interests와의 similarities의 array를 구할 수 있음
    ```py
    def most_similar_interests_to(interest_id):
      similarities = interest_similarities[interest_id]
      pairs = [(unique_interests[other_interest_id], similarity)
                for other_interest_id, similarity in enumerate(similarities)
                if interest_id != other_interest_id and similarity > 0]
      return sorted(pairs,
                    key=lambda (_, similarity): similarity,
                    reverse=True)
    ```
      - results: 참고
      ```[('Hadoop', 0.8164965...),
          ('Java', 0.66666...),
        ....]
      ```
  4. create recommendations for a user by summing up the similarities of the interests similar to his:
    - user를 입력 받으면 user의 interests vector를 interest 별로 각각 similar_interests를 구해서 각 interests 별로 similarity를 합산하여 가장 높은 similarity 값을 가지는 interests를 순서대로 추천
    ```py
    def item_based_suggestions(user_id, include_current_interests=False):
    suggestions = defaultdict(float)
    user_interest_vector = user_interest_matrix[user_id]
    for interest_id, is_interested in enumerate(user_interest_vector):
        if is_interested == 1:
            similar_interests = most_similar_interests_to(interest_id)
            for interest, similarity in similar_interests:
                suggestions[interest] += similarity

    suggestions = sorted(suggestions.items(),
                         key=lambda pair: pair[1],
                         reverse=True)

    if include_current_interests:
        return suggestions
    else:
        return [(suggestion, weight)
                for suggestion, weight in suggestions
                if suggestion not in users_interests[user_id]]
    ```
    - results: 참고
      ```
      [('MapReduce', 1.861807...),
        ...]
      ```
