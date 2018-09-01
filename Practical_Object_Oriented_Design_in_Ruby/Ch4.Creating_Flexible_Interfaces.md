# Creating Flexible Interfaces

## Understanding Interfaces
* class interface
  - public interface
  - virtual class

## Defining Interfaces
* public interfaces
* private interfaces
* Responsibilities, Dependencies, and Interfaces

## Finding the Public Interface
### Constructing an Intention
* domain objects
  - *nouns* in the application that have both *data* and *behavior*
* *messages*
* **Focus not on these objects but on the messages that pass between them**
### Using Sequence Diagram
* Sequence diagrams
  - *objects* and the *messages* passing between them
### Asking for "What" Instead of Telling "How"
* trip 시 bicyle 준비는 trip이 어떻게 하는지 알 필요 없고, mechanic에게 요청만 하도록 한다.
  - 다른 object의 how를 알 필요는 없다.
### Seeking Context Independence
* simple context
  - easy to use
  - easy to test
* object가 context에 independent 한 것이 좋다.
* dependency injection
  - 서로 모르는 object들이 상호 작용을 할 수 있도록 하는 기법
  - Trip이 Mechanic에 대한 지식 없이 invoke 할 수 있도록 함
* *what*과 *how*의 구분
### Trusting Other Objects

### Using Messages to Discover Objects

### Creating a Message-Based Application

## Writing Code That Puts Its Best (Inter)Face Forward
*
