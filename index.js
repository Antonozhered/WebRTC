const express = require('express')
const app = express()
const fs = require('fs');

const options = {
    key: fs.readFileSync('./localhost.key'),
    cert: fs.readFileSync('./localhost.crt')
};

const server = require('https').Server(options, app);
const port = 3000

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' ws: wss:; media-src 'self'");
    next();
});

app.use(express.static('public'));

server.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('message', (msg) => {
        io.emit('message', msg);
    });
});


