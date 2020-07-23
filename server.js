require('dotenv').config();
var express = require('express');
var path = require('path');
var ws = require('ws');
const bodyParser = require('body-parser');

const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const messages = [];

const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
    socket.on('message', message => {
        socket.send(JSON.stringify(messages));
    });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/reader', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/reader.html'));
});

app.post('/reader', (req, res) => {
    const { message } = req.body;
    messages.push(message);
    res.sendStatus(200);
});

app.get('/publisher', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/publisher.html'));
});


const server = app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`);
});

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
});
