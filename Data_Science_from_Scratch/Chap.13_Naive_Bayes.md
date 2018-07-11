# Chapter 13. Naive Bayes

## Problem
- 어떤 message가 있을때 그 message가 spam인지 아닌지 판단하는 filter를 만들기

## A Really Dumb Spam Filter
* 하나의 단어를 spam으로 처리하는 filter: viagra를 spam으로 처리하는 filter
* Bayer's Theorem
  - reversing conditional probabilities
  - V가 일어났을때 S가 일어날 확률을 S가 일어났을때 V가 일어날 확률로 구함
    - spam message중 viagra가 있을 경우 데이터를 이용하여 viagra가 들어 있을때 spam일 확률 구하기
  - ```P(S|V)```: **viagra 단어가 들어 있을때 spam message 확률**
    - spam message일때 viagra가 들어있을 확률과 spam message가 아닐때 viagra가 들어 있는 확률로 구함
    - ```S```: message가 spam 인 event
    - ```V```: message에 'viagra'가 들어 있는 event
  - 책 예제
    - viagra가 포함된 message가 spam일 확률
    - message가 spam일 확률과 아닐 확률이 반반으로 가정
    - spam message에 viagra가 있는 경우 50%
    - nonspam message에 viagra가 있는 경우 1%
    ```0.5 / (0.5 + 0.01) = 98%```

## A More Sophisticated Spam Filter
* 많은 단어 목록을 가지고 filter
* ```P(Xi|S)```: spam message가 특정 wi word를 가질 확률
  - ```w1 ~ wn```: words
  - ```Xi```: word ```wi``` 가 message에 포함된 event
* Naive Bayes
  - 각각의 사건들이 **독립적**이라고 가정, word간 서로 연관성 없음
  - viagra란 단어가 있는 message에 rolex란 단어가 있는 연관은 없음
  - 독립 사건, 각각의 확률의 곱으로 게산
* 예제
  - words: ["viagra", "rolex"]
  - spam message들 중 반은 "cheap viagra", 나머지 반은 "authentic rolex"
  - spam message에 viagra와 rolex가 동시에 함께 포함되지 않는다고 가정
  - Bayes's Theorem으로 message에 대해서 각 word 별로 구한 ```P(S | X = x)```를 독립적으로 생각하고 모두 곱으로 계산
* Problems
  * *underflow* problem
    - 많은 확률을 서로 곱하게 되는 되는 문제
    - computer는 0에 너무 가까운 floating-point number 계산을 잘 다루지 못함.
      ```log(ab) = log a + log b```, ```exp(log x) = x```
    - ```P1 * ... Pn = exp(log (P1) + ... log (Pn))```: 곱 -> 합
  * ```P(Xi | S)```를 구할때 발생하는 데이터 관련 문제
    - 'data' word가 nonspam message에만 나타날 경우  ```P("data" | S) = 0```이 됨
    - 이 경우 'data' word가 있을 경우 다른 spam 관련 단어가 있어도 spam일 확률을 0으로 계산하는 문제가 발생(곱셈)
    - 완화(smoothing)하는 방법을 사용: *peudocount* *k*을 더 해줌
    - word가 spam일 확률이 0이 되지 않도록 만드는 보정값
      ```P(Xi | S) = (k + number of spams containing wi)/(2k + number of spams)```
    - spam: 98, data: 0, k = 1
      ```P("data" | S) = 1 / 100 = 0.01```

## Implementation
* Build classifier
  - tokenize messages (```def tokenize```)
  - count words (```def count_words```): training set으로 부터 dictionary를 구함(key: words, values [spam_count, non_spam_count]), 해당 word가 spam과 nonspam message에서 얼마나 많이 나타났는지 count
  - counts를 확률로 계산(smoothing도 포함) (```def word_probabilities```)
    - list of triplets w, p(w | spam), p(w | -spam) 을 리턴
  - Naive Bayes assumption을 이용하여 word 확률을 구함 (```def spam_probability```)

## Testing Our Model
* SpamAssassin의 spam 테스트 데이터를 이용하여 테스트
  - Subject line만을 이용하여 spam여부 판단 테스트
  - training data와 test data로 나누고 테스트
  - 결과
    - true positives (spam을 spam으로 판단): 101
    - false positives (spam이 아닌것을 spam을 판단): 33
    - true negatives (spam이 아닌것일 spam이 아닌 것으로 판단): 704
    - false negatives (spam을 spam이 아닌 것으로 판단): 38
  - 평가
    - spam filter 정확도: 75 % = 101 / (101 + 33)
    - spam을 걸러낸 정확도: 73 % = 101 / (101 + 38)
  - 가장 misclassified 한 것 분석
    - 데이터 확인 및 원인 분석
    - spam 확율에 따라 정렬하여 확인함
      - non-spam인데 spam이라고 판단한 것 (상위)
      - spam인데 non-spam이라고 판단한 것 (하위)
* spam filter의 성능을 높이는 방법
  - 더 많은 데이터로 train
  1. subject line 뿐만 아니라, message content도 확인
  2. 모든 word를 training set에 넣고, min_count threshold를 이용하여 자주 나오지 않는 단어를 무시하여 정확도를 향상
  3. 유사 단어를 같은 단어로 처리 [Porter Stemmer](https://tartarus.org/martin/PorterStemmer/)
  4. 다른 spam을 판별하기 위한 기능을 추가: number를 포함한 message
