const parser = require("./parser")

test("parse 1", () => {
  const text = "boat 1000\nbird 3000"
  expect(parser.parse(text)).toEqual([
    { names: ["boat"], prices: ["1000"] },
    { names: ["bird"], prices: ["3000"] }
  ])
})

test("parse 2", () => {
  const text = "boat 1000 2000\nbird 3000 4000"
  expect(parser.parse(text)).toEqual([
    { names: ["boat"], prices: ["1000", "2000"] },
    { names: ["bird"], prices: ["3000", "4000"] }
  ])
})

test("parse 3", () => {
  const text = "a b 1000\nc d e 2000 3000 4000"
  expect(parser.parse(text)).toEqual([
    { names: ["a", "b"], prices: ["1000"] },
    { names: ["c", "d", "e"], prices: ["2000", "3000", "4000"] }
  ])
})

test("parse 4", () => {
  const text = "a b 100+200\nc 10+2 20-10 100/2 500*3"
  expect(parser.parse(text)).toEqual([
    { names: ["a", "b"], prices: ["100+200"] },
    { names: ["c"], prices: ["10+2", "20-10", "100/2", "500*3"] }
  ])
})

test("parse 5", () => {
  const text = "+10% +7%"
  expect(parser.parse(text)).toEqual([{ names: [], prices: ["+10%", "+7%"] }])
})

test("parse 6", () => {
  const text = "a 100 b 200\nc 300"
  expect(parser.parse(text)).toEqual([
    { names: ["a"], prices: ["100"] },
    { names: ["b"], prices: ["200"] },
    { names: ["c"], prices: ["300"] }
  ])
})

test("parse 7", () => {
  const text = "1000 a b 100 c\n d 300"
  expect(parser.parse(text)).toEqual([
    { names: ["a", "b"], prices: ["1000"] },
    { names: ["c"], prices: ["100"] },
    { names: ["d"], prices: ["300"] }
  ])
})

test("scenario 1", () => {
  const text = "boat 100 1000/3\nlouis 300 1000/3\nprun 200 1000/3\n+10% +7%"
  expect(parser.parse(text)).toEqual([
    { names: ["boat"], prices: ["100", "1000/3"] },
    { names: ["louis"], prices: ["300", "1000/3"] },
    { names: ["prun"], prices: ["200", "1000/3"] },
    { names: [], prices: ["+10%", "+7%"] }
  ])
})

test("scenario 2", () => {
  const text = "boat louis prun 1000 2000"
  expect(parser.parse(text)).toEqual([{ names: ["boat", "louis", "prun"], prices: ["1000", "2000"] }])
})

test("scenario 3", () => {
  const text = "1000 2000 3000 boat louis prun"
  expect(parser.parse(text)).toEqual([{ names: ["boat", "louis", "prun"], prices: ["1000", "2000", "3000"] }])
})
