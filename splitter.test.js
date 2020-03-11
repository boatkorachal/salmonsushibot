const splitter = require("./splitter")

test("split 1", () => {
  const commands = [
    { names: ["boat"], prices: ["1000"] },
    { names: ["bird"], prices: ["3000"] }
  ]

  expect(splitter.process(commands)).toEqual({
    boat: 1000,
    bird: 3000
  })
})

test("split 2", () => {
  const commands = [
    { names: ["boat"], prices: ["1000", "2000"] },
    { names: ["bird"], prices: ["3000", "4000"] },
    { names: ["boat"], prices: ["1000"] }
  ]

  expect(splitter.process(commands)).toEqual({
    boat: 4000,
    bird: 7000
  })
})

test("split 3", () => {
  const commands = [
    { names: ["a", "b"], prices: ["1000"] },
    { names: ["c", "d", "e"], prices: ["2000", "3000", "4000"] }
  ]

  expect(splitter.process(commands)).toEqual({
    a: 500,
    b: 500,
    c: 3000,
    d: 3000,
    e: 3000
  })
})

test("split 4", () => {
  const commands = [
    { names: ["a", "b"], prices: ["100+200"] },
    { names: ["c"], prices: ["10+2", "20-10", "100/2", "500*3"] }
  ]

  expect(splitter.process(commands)).toEqual({
    a: 150,
    b: 150,
    c: 1572
  })
})

test("split 5", () => {
  const commands = [
    { names: [], prices: ["1000", "2000"] },
    { names: ["a", "b", "c"], prices: [] }
  ]

  expect(splitter.process(commands)).toEqual({
    a: 1000,
    b: 1000,
    c: 1000
  })
})

test("split 6", () => {
  const commands = [{ names: ["a"], prices: ["1000/0", "100"] }]

  expect(splitter.process(commands)).toEqual({
    a: 100
  })
})

test("scenario 1", () => {
  const commands = [
    { names: ["boat"], prices: ["100", "1000/4"] },
    { names: ["louis"], prices: ["300", "1000/4"] },
    { names: ["prun"], prices: ["200", "1000/4"] },
    { names: ["tung"], prices: ["500", "1000/4"] },
    { names: [], prices: ["+10%", "+7%"] }
  ]

  expect(splitter.process(commands)).toEqual({
    boat: 411.95,
    louis: 647.35,
    prun: 529.65,
    tung: 882.75
  })
})
