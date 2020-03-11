const path = require("path")
const line = require("@line/bot-sdk")
const express = require("express")
const _ = require("lodash")
const generateQRPayload = require("promptpay-qr")
const qrcode = require("qrcode")
const middleware = require("./middleware")
const parser = require("./parser")
const splitter = require("./splitter")
const store = require("./store")

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
  splitPrefix: process.env.BOT_SPLIT_PREFIX || "@split",
  paymePrefix: process.env.BOT_PAYME_PREFIX || "@payme",
  publicUrl: process.env.PUBLIC_URL,
  port: process.env.PORT || 8080
}

const client = new line.Client(config)

const app = express()

app.use("/public", express.static("public"))

const stripPrefix = (text, prefix) => {
  return text.indexOf(prefix) === 0 ? text.slice(prefix.length) : text
}
const render = result => {
  const lines = _.map(result, (pay, name) => `${name} = ${pay.toFixed(2)}`)
  const total = _.reduce(result, (acc, pay) => acc + pay, 0)
  return [...lines, `total: ${total.toFixed(2)}`].join("\n")
}

const getFileName = (name, payload) => `${name}_${payload}.png`

const handleSplitCommand = (req, res) => {
  const event = req.event
  const messageText = stripPrefix(event.message.text, config.splitPrefix)
  const commands = parser.parse(messageText)
  const result = splitter.process(commands)
  const replyText = render(result)

  store.saveLastSplitResult(event, result)

  client.replyMessage(event.replyToken, { type: "text", text: replyText }).then(() => res.json({}))
}

const handlePaymeCommand = (req, res) => {
  const event = req.event
  const messageText = stripPrefix(event.message.text, config.paymePrefix)
  const result = store.getLastSplitResult(event)
  if (!result) return res.status(400).json({ error: "result not found" })

  const qrTarget = messageText.trim()
  const qrByNames = _.mapValues(result, pay => ({
    pay: pay.toFixed(2),
    qrPayload: generateQRPayload(qrTarget, { amount: pay })
  }))

  const promises = _.map(qrByNames, ({ qrPayload, pay }, name) => {
    return new Promise((resolve, reject) => {
      const filename = getFileName(name, qrPayload)
      const filePath = path.join(__dirname, "public", filename)
      qrcode.toFile(
        filePath,
        qrPayload,
        {
          color: {
            dark: "#000",
            light: "#FFF"
          }
        },
        err => {
          if (err) return reject(err)
          return resolve({ name, filename, pay })
        }
      )
    })
  })

  Promise.all(promises).then(qrs => {
    const messages = _.map(qrs, ({ name, filename, pay }) => {
      const url = `${config.publicUrl}/public/${filename}`
      const contents = {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: `${name} = ${pay}`
            }
          ]
        },
        hero: {
          type: "image",
          url: url,
          size: "full",
          aspectRatio: "1:1"
        }
      }
      const message = { type: "flex", altText: "QR Image", contents: contents }
      return message
    })

    client.replyMessage(event.replyToken, messages).then(() => res.json({}))
  })
}

app.post(
  "/callback",
  line.middleware(config),
  middleware.interceptTestMessage,
  middleware.assignEvent,
  // middleware.filterGroupMessage,
  middleware.filterPrefixes([config.splitPrefix, config.paymePrefix]),
  (req, res) => {
    const commandPrefix = req.commandPrefix
    if (commandPrefix === config.splitPrefix) return handleSplitCommand(req, res)
    else if (commandPrefix === config.paymePrefix) return handlePaymeCommand(req, res)
    else res.status(500).json({ error: "unhandled command" })
  }
)

app.listen(config.port, () => {
  console.log(`listening on ${config.port}`)
})
