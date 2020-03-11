const line = require("@line/bot-sdk")
const express = require("express")
const _ = require("lodash")
const middleware = require("./middleware")
const parser = require("./parser")
const splitter = require("./splitter")

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
  prefix: process.env.BOT_PREFIX || "@split",
  port: process.env.PORT || 8080
}

const client = new line.Client(config)

const app = express()

const stripPrefix = (text, prefix) => {
  return text.indexOf(prefix) === 0 ? text.slice(prefix.length) : text
}
const render = result => {
  const lines = _.map(result, (pay, name) => `${name} = ${pay.toFixed(2)}`)
  const total = _.reduce(result, (acc, pay) => acc + pay, 0)
  return [...lines, `total: ${total.toFixed(2)}`].join("\n")
}

app.post(
  "/callback",
  line.middleware(config),
  middleware.interceptTestMessage,
  middleware.assignEvent,
  // middleware.filterGroupMessage,
  middleware.filterPrefix(config.prefix),
  (req, res) => {
    const event = req.event
    const messageText = stripPrefix(event.message.text, config.prefix)
    const commands = parser.parse(messageText)
    const result = splitter.process(commands)
    const replyText = render(result)
    client.replyMessage(event.replyToken, { type: "text", text: replyText }).then(() => res.json({}))
  }
)

app.listen(config.port, () => {
  console.log(`listening on ${config.port}`)
})
