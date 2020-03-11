const utils = require("./utils")

test("utils 1", () => {
  const isZero = item => item === 0
  const items = [0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1]

  expect(utils.chunkWhile(items, isZero)).toEqual([[0, 0, 0], [1, 1], [0, 0], [1], [0], [1, 1, 1]])
})

test("utils 2", () => {
  const isZero = item => item === 0
  const items = []

  expect(utils.chunkWhile(items, isZero)).toEqual([])
})

test("utils 3", () => {
  const isZero = item => item === 0
  const items = [1]

  expect(utils.chunkWhile(items, isZero)).toEqual([[1]])
})
