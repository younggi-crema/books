# Chap 13. Javascript and the Browser
* Broser는 여러 벤더에 의해 각각 발전해 왔었고, 표준이 만들어 졌으나, 완전히 동일한 결과를 보이지는 않음

## Networks and the Internet
* Internet
  - computer를 network로 연결하고자 하는 시도에서 만들어짐
* network protocol
  - network을 통해 communication 방식
* Hypertext Transfer Protocol (HTTP)
  ```
  GET /index.html HTTP/1.1
  ```
* Transmission Control Protocol (TCP)
  - HTTP가 사용되는 기반 protocol
  - server: listening with port
  - client: calling with port

## The Web
* World Wide Web
  - browser를 이용하여 web page를 사용하기 위한 format과 protocol의 집합
* Uniform Resource Locator (URL)
  ```
  http://eloguentjavascript.net/13_browser.html
  |     |                      |               |
  protocol       server               path
  ```
* IP address, domain name
  - 149.210.142.219, eloquentjavascript.net

## HTML
* Hypertext Markup Language
  - document format for web page
  - tag를 이용하여 text의 structure를 구성
  - 구성
    - doctype
    - header
    - opening tag, closing tag
    - attribute
    - entity special notation: `&lt;`
 ```html
 <!doctype html>
 <html>
  <head>
    <meta charset="utf-8">
    <title>My home page</title>
  </head>
  <body>
    <h1>My home page</h1>
    <p>Hello, I am Marijn and this is my home page.</p>
    <p>I also wrote a book! Read it
      <a href="http://eloquentjavascript.net">here</a>
    </p>
  </body>
 </html>
 ```
  - HTML is parsed in a remarkably error-tolerant way.

## HTML and Javascript
* `<script>` tag
  - `</script>` tag를 꼭 닫을 것
  ```html
  <h1>Testing alert</h1>
  <script>alert("hello!");</script>

  <script src="code/hello.js"></script>
  ```
* attribute에서 Javascript를 가지는 경우
  ```html
  <button onclick="alert('Boom!');">DO NOT PRESS</button>
  ```

## In the Sandbox
* sandboxing
  - browser가 웹에서 다운 받은 javascript 프로그램이 사용자의 pc와 격리된 환경에서 실행하도록 함

## Compatibility and The Browser Wars
* Browsers
  * Mosaic
  * Netscape
  * Microsoft Internet Explorer
  * Mozilla Firfox (late 2000s)
  * Chrome browser
  * Apple's Safari
  * Edge browser
* New Browser player
  - standards
  - better engineering practices
  - less incompatibility
  - fewer bugs
