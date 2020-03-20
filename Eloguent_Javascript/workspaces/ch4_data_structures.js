// Data Sets
let listOfNumbers = [2, 3, 5, 7, 11];
console.log(listOfNumbers[2]);

// Properties
// null.length
// value.x
// value[x] = value["x"]

// Methods
let doh = "Doh";
console.log(typeof doh.toUpperCase);
console.log(doh.toUpperCase());

let sequence = [1, 2, 3];
sequence.push(4);
sequence.push(5);
console.log(sequence);
console.log(sequence.pop());
console.log(sequence);

// Objects
let day1 = {
  squirrel: false,
  events: ["work", "touched tree", "pizza", "running"]
};
console.log(day1.squirrel);
console.log(day1.wolf);
day1.wolf = false;
console.log(day1.wolf);

let descriptions = {
  work: "Went to work",
  "touched tree": "Touched a tree"
};

let anObject = {left: 1, right: 2};
console.log(anObject.left);
delete anObject.left;
console.log(anObject.left);
console.log("left" in anObject);
console.log("right" in anObject);

console.log(Object.keys({x: 0, y: 0, z: 2}));
let objectA = {a: 1, b: 2};
Object.assign(objectA, {b: 3, c:4});
console.log(objectA);

// Mutability
let object1 = {value: 10};
let object2 = object1;
let object3 = {value: 10};

console.log(object1 == object2);
console.log(object1 == object3);

const score = {visitors: 0, home: 0};
score.visitors = 1;
// This isn't allowed
//score = {visitors: 1, home: 1};

// The lycanthrope's log
let journal = [];
function addEntry(events, squirrel) {
  journal.push({events, squirrel});
}
addEntry(["work", "touched tree", "pizza", "running", "television"], false);
addEntry(["work", "ice cream", "cauliflower", "lasagna", "touched tree", "brushed teeth"], false);
addEntry(["weekend", "cycling", "break", "peanuts", "beer"], true);

console.log(journal);

// Array Loops
JOURNAL = journal
for (let i = 0; i < JOURNAL.length; i++) {
  let entry = JOURNAL[i];
  console.log(entry)
}

// of는 array, string, object를 순회한다
for (let entry of JOURNAL) {
  console.log(`${entry.events.length} events.`);
}

str = "strings"
for (let ch of str) {
  console.log(`${ch}`);
}

// REST Parameters
function max(...numbers) {
  let result = -Infinity;
  for (let number of numbers) {
    if (number > result) result = number;
  }
  return result;
}
console.log(max(4, 1, 9, -2));

let words = ["never", "fully"];
console.log(["will", ...words, "understand"]);

// Math
// namespace: Math

// Destructing
// array, object
ds_arr = [1, 2, 3];
function print123([a, b, c]) {
  console.log(`${a} ${b} ${c}`);
}
print123(ds_arr);
[a, b, c] = ds_arr;
console.log(a);
let {name} = {name: "Faraji", age: 23};
console.log(name);

// JSON
let jsonString = JSON.stringify({squirrel: false, events: ["weekend"]});

console.log(jsonString);
console.log(JSON.parse(jsonString).events);
