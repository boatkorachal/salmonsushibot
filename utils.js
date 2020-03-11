const _ = require("lodash")

exports.chunkWhile = (items, predicate) => {
  const splitWhile = (items, predicate) => {
    if (items.length === 0) return []
    const matchedItems = _.takeWhile(items, predicate)
    return [matchedItems, _.dropWhile(items, predicate)]
  }

  const extractAll = (items, predicate) => {
    if (items.length === 0) return []
    const [extracted, rest] = splitWhile(items, predicate)
    if (extracted.length === 0) return extractAll(rest, _.negate(predicate))
    return [extracted].concat(extractAll(rest, _.negate(predicate)))
  }

  return extractAll(items, predicate)
}
