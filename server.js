require("dotenv").config();
var express = require("express");
var path = require("path");
var test_data = require("./test_data");
const bodyParser = require("body-parser");

const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const messages = [...test_data];

app.use(express.static(path.join(__dirname, "/public")));

app.get("/editor", (_, res) => {
  res.sendFile(path.join(__dirname, "/public/editor/editor.html"));
});

app.post("/editor", (req, res) => {
  const { message } = req.body;
  if (messages.length == 100) {
    messages.shift();
  }
  messages.push(message);
  res.sendStatus(200);
});

app.get("/messages", (req, res) => {
  res.send(JSON.stringify(messages));
});

app.get("/publisher", (_, res) => {
  res.sendFile(path.join(__dirname, "public/publisher/publisher.html"));
});

app.get("*", (req, res) => {
  res.redirect("https://paperboy.glitch.me/editor");
});

const server = app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
});
