const _ = require("lodash")

exports.interceptTestMessage = (req, res, next) => {
  const events = req.body.events
  const isTestMessage = events.some(
    event =>
      event.replyToken === "00000000000000000000000000000000" || event.replyToken === "ffffffffffffffffffffffffffffffff"
  )

  return isTestMessage ? res.json({}) : next()
}

const ack = res => res.status(200).send("")

exports.assignEvent = (req, res, next) => {
  const event = req.body.events[0]
  if (!event) return ack(res)

  req.event = event

  return next()
}

exports.filterGroupMessage = (req, res, next) => {
  const { type, source, message } = req.event
  if (type !== "message" || source.type !== "group" || message.type !== "text") return ack(res)

  req.groupMessage = event

  return next()
}

exports.filterPrefixes = prefixes => (req, res, next) => {
  const messageText = req.event.message.text
  const foundPrefix = _.find(prefixes, prefix => messageText.startsWith(prefix))

  if (!foundPrefix) return ack(res)

  req.commandPrefix = foundPrefix
  return next()
}
