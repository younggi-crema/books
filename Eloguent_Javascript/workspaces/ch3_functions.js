console.log("The future says:", future());

function future() {
  return "You'll never have flying cars";
}

const future1 = function() {
  return "You'll never have flying boats";
};

console.log("The future says:", future1());

const power = (base, exponent) => {
  let result = 1;
  for (let count = 0; count < exponent; count++) {
    result *= base;
  }
  return result;
};

console.log(power(2, 3));

const square1 = (x) => { return x * x; };
const square2 = x => x * x;

const horn = () => {
  console.log("Toot");
};

// The Call Stack
function greet(who) {
  console.log("Hello " + who);
}
greet("Harry");
console.log("Bye");

// Optional Arguments
function square(x) { return x * x; }
console.log(square(4, true, "hedgehog"));

function minus(a, b) {
  if (b === undefined) return -a;
  else return a - b;
}

console.log(minus(10));
console.log(minus(10, 5));

function power2(base, exponent = 2) {
  let result = 1;
  for (let count = 0; count < exponent; count++) {
    result *= base;
  }
  return result;
}

console.log(power2(4));
console.log(power2(2, 6));

// Closure
// - Being able to reference a specific instance of a local binding in an enclosing scope
function wrapValue(n) {
  let local = n;
  return () => local;
}

let wrap1 = wrapValue(1);
let wrap2 = wrapValue(2);
console.log(wrap1());
console.log(wrap2());
console.log(wrap1);
console.log(wrap2);

function multiplier(factor) {
  return number => number * factor;
}

let twice = multiplier(2);
console.log(twice(5));

// Recursion
function power3(base, exponent) {
  if (exponent == 0) {
    return 1;
  } else {
    return base * power3(base, exponent - 1);
  }
}

console.log(power3(2, 3));

function findSolution(target) {
  function find(current, history) {
    if (current == target) {
      return history;
    } else if (current > target) {
      return null;
    } else {
      return find(current + 5, `(${history} + 5)`) || find(current * 3, `(${history} * 3`);
    }
  }
  return find(1, "1");
}

console.log(findSolution(24));

// Functions and Side Effects
