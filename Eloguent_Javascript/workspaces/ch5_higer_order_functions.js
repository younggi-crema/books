// Abstracting repetition
function repeatLog(n) {
  for (let i = 0; i < n; i++) {
    console.log(i);
  }
}

function repeat(n, action) {
  for (let i =0; i < n; i++) {
    action(i);
  }
}

repeatLog(3);
repeat(3, console.log);

let labels = [];
repeat(5, i => {
  labels.push(`Unit ${i + 1}`);
});
console.log(labels);

// Higher-Order Functions
function unless(test, then) {
  if (!test) then();
}

repeat(3, n => {
  unless(n % 2 == 1, () => {
    console.log(n, "is even");
  });
});

// forEach, filter, map, reduce
