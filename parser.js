const _ = require("lodash")
const utils = require("./utils")

// [name] 1000 2000 500/2
const NAME_REGEX = /^[^0-9-+]+/
const PRICE_REGEX = /^[0-9-+*\/.%]+$/

const isName = token => NAME_REGEX.test(token)
const isPrice = token => PRICE_REGEX.test(token)

const buildCommand = tokens => {
  const [names, prices] = tokens.reduce(
    ([names, prices], token) => {
      if (isName(token)) return [[...names, token.toLowerCase()], prices]
      if (isPrice(token)) return [names, [...prices, token]]
      return [names, prices]
    },
    [[], []]
  )
  return { names: names, prices: prices }
}

const parseLineTokens = tokens => {
  // [a a a b b a b b a]
  // [[a a a] [b b] [a] [b b] [a]]
  // [ [[a a a] [b b]] [[a] [b b]] [[a]] ]
  // [[a a a b b] [a b b] [a]]

  const chunkByType = utils.chunkWhile(tokens, isName)
  const sublineTokens = _.chain(chunkByType)
    .chunk(2)
    .map(arrPair => _.flatten(arrPair))
    .value()

  return sublineTokens.map(buildCommand)
}

const parseLine = text => {
  const lineTokens = text
    .trim()
    .split(" ")
    .filter(s => s !== " ")
  return parseLineTokens(lineTokens)
}

exports.parse = text => {
  return text.split("\n").flatMap(parseLine)
}
