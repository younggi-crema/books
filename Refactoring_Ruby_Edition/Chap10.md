# Chap 10. Making Method Calls Simpler
* Interface를 좀 더 명확하게 하는 refactoring
  - Change the name of method
    - method name을 명확하게
  - Add or Remove parameters
    - parmeter 수를 줄임
  - Method body를 명료하게 변경

## Rename Method
* Method name이 purpose를 표현하지 못하는 경우
  - code for human first and computer second
* Mechanics
  1. superclass나 subclass에 동일한 method signature가 있는지 확인
  2. 새로운 method를 작성하고 기존 코드를 복사
  3. 기존 method의 body를 새로운 method를 호출하도록 변경
  4. Test
  5. 기존 method를 호출하는 부분을 모두 찾아 새로운 method를 호출하도록 변경
  6. 기존 method를 제거
  7. Test
* Example (P.300)
  - `telephone_number` -> `office_telephone_number`


## Add Parameter
* Method가 caller로 부터 더 많은 정보가 필요한 경우
  - *다른 대안이 있는지 먼저 확인할 필요가 있음*
  - Long Parameters list는 기억하기 어렵고, data clumps(구분 되지 않은 데이터가 나열)를 유발
* Mechanics
  - Ruby는 method overloading을 지원하지 않기 때문에 새로운 method를 테스트 후 기존 method와 이름을 서로 변경

## Remove Parameter
* Parameter가 method body에서 더 이상 사용되지 않는 경우
  - 사용되지 않는 parameter를 삭제한다


## Separate Query from Modifier
* Method가 value를 return하고(Query), object의 state를 change(Modifier)하는 경우
  - value를 알기 위해 원하는 만큼 호출 가능해 지도록, 상태가 변경되는 side effect가 없는 method를 만든다
  - method를 명료하게
  - 두 method로 분리
    1. query: value를 return
    2. modifier: object state를 change
* Example (p305)
* Concurrency Issues
  - query와 modify가 synchrnoized 되어야 함


## Parameterize Method
* 비슷한 일을 하지만 body에 다른 value를 가지고 있는 method가 여러 개 있을 경우
  - method를 새로 하나 만들고, 다른 value를 parameter를 사용하도록 변경
  - 여러 개의 중복된 method를 하나의 method로 통합
* Example

## Replace Parameter with Explicit Methods
* Enumerated parameter value에 따라 다른 코드를 실행하는 하나의 method가 있을 경우
  - 각 parameter에 따라 분리된 method를 생성한다.
  - method body를 명료하게


## Preserve Whole Object
* Object내의 여러 개의 value를 각각 꺼내서 method에 values를 보내는 경우
  - object 자체를 전달한다
  - parameter 수를 줄임
  - 장점
    - 코드가 좀 더 읽기 쉽게 됨
  - 단점
    - object의 dependency가 생길 수 있음
* Example

## Replace Parameter with Method
* Method를 호출한 result object를 다른 method의 parameter로 만 사용되는 경우
  - parameter를 삭제하고 method를 receiver가 parameter를 구하는 method를 내부에서 invoke한다.
  - parameter 수를 줄임

## Introduct Parameter Object
* 같이 다루는 parameter들의 group이 있는 경우
  - parameter들을 새로운 object(immutable)로 바꾼다.
  - parameter 수를 줄임
* Example

## Remove Setting Method
* Field가 최초에 생성되고 변경되지 않는 경우
  - 해당 field의 set method를 없앤다

## Hide Method
* Method가 다른 class에서 사용되지 않을때
  - method를 private으로 변경한다

## Replace Constructor with Factory Method
* object를 생성하는 단순 constructor 이상이 필요할 경우
  - factory method를 만들어 constructor를 대신한다.

## Replace Error Code with Exception
* method가 error를 표시하는 특정한 code를 리턴하는 경우
  - error 코드 대신 exception을 발생시킨다.
* Example

## Replace Exception with Test
* method내에서 먼저 조건을 체크하고 exception을 발생하는 경우
  - 먼저 조건을 테스트하도록 변경한다.
  - Method를 호출하기 전에 먼저 조건을 테스트하여 `begin-rescue` block을 제거할 수 있음
* Example

## Introduce Gateway
* 외부의 system이나 resource와 복잡한 API로 interact 하는 경우
  - 외부 system이나 resource를 access를 캡슐화한 Gateway를 만든다.
  - Method 단순화, 중복 제거
* Example

## Introduce Expression Builder
* public interface와 interact할때 좀 더 쉽게 하고자 할때
  - interface에 호출하는 내용을 쉽게 만들어 주는 Expression Builder를 만든다
* Example
