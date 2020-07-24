require('dotenv').config();
var express = require('express');
var path = require('path');
var ws = require('ws');
const bodyParser = require('body-parser');

const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const messages = ['initial'];

const wsServer = new ws.Server({ noServer: true });

wsServer.on('connection', function connection(ws) {
    setInterval(function () {
        broadcast(wsServer);
    }, 3000);
});


app.use(express.static(path.join(__dirname, 'public')));

app.get('/editor', (_, res) => {
    res.sendFile(path.join(__dirname, 'public/editor.html'));
});

app.post('/editor', (req, res) => {
    const { message } = req.body;
    messages.push(message);
    res.sendStatus(200);
});

app.get('/publisher', (_, res) => {
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

function broadcast(websocket) {
    websocket.clients.forEach(function each(client) {
        if (client.readyState === ws.OPEN) {
            client.send(JSON.stringify(messages));
        }
    });
}
