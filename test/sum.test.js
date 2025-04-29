const sum = require("./sum");

test("add 1+2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);  // Verifica che la somma di 1 e 2 sia 3
  expect(sum(1, 2)).toBeGreaterThan(2);  // Verifica che la somma di 1 e 2 sia maggiore di 2
});