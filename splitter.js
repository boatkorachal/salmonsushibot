const mathjs = require("mathjs")
const _ = require("lodash")

exports.process = commands => {
  const [splitByNamesCommands, splitAllCommands] = _.partition(commands, command => command.names.length > 0)

  let result = splitByNamesCommands.reduce(handleSplitByNames, {})
  result = splitAllCommands.reduce(handleSplitAll, result)

  return result
}

const handleSplitByNames = (acc, { names, prices }) => {
  const uniqueNames = _.uniq(names)
  const sumPrice = prices.reduce((acc, price) => acc + mathjs.eval(price), 0)
  const pricePerName = sumPrice / uniqueNames.length

  return uniqueNames.reduce((acc, name) => {
    if (!acc[name]) return { ...acc, [name]: pricePerName }
    return { ...acc, [name]: acc[name] + pricePerName }
  }, acc)
}

const PRICE_PERCENT_REGEX = /%$/
const handleSplitAll = (acc, { prices }) => {
  const splitAll = (acc, price) => {
    if (PRICE_PERCENT_REGEX.test(price)) {
      const percent = parseFloat(price)
      return _.mapValues(acc, pay => pay + (pay * percent) / 100)
    } else {
      const fixed = parseFloat(price)
      const pricePerName = fixed / _.size(acc)
      return _.mapValues(acc, pay => pay + pricePerName)
    }
  }

  return prices.reduce(splitAll, acc)
}
