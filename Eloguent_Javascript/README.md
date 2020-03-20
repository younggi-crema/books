# Elogquent Javascript

## Chap 1. Values, Types, And Operators
* Values
* Numbers
* Arithmetic
* Special Numbers
  - Infinity
  - -Infinity
* Strings
  - `\n`: newline
  - concatenate: `"con" + "cat"`
  - template literals
    ```js
    `half of 100 is ${100 / 2}`
    ```
* Unary Operators
  - `typeof`
    ```js
    console.log(typeof 4.5)
    // -> number
    ```
  - `-`
* Boolean values
* Comparison
* Logical Operators
  - `$$`, `||`
* Empty values
  - 두 값 모두 의미 없는 값임
  - `null`
  - `undefined`
* Automatic Type Conversion
  - type coercion
  ```js
  console.log(null == undefined);
  // -> true
  console.log(null == 0);
  // -> false
  ```
  - `===`, `!==`: value, type 모두 비교를 위해 다음 operators 사용
* Short-Circuiting of Logical operators
