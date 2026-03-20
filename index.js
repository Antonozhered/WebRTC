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
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; connect-src 'self' ws: wss:; media-src 'self'");
    next();
});

app.use(express.static('public'));

server.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

const { Server } = require("socket.io");
const io = new Server(server);

let peers = {}; // Track connected peers

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);
    peers[socket.id] = socket;

    // Relay WebRTC signals between peers
    socket.on('signal', (data) => {
        if (data.to) {
            // Direct signal to specific peer
            console.log(`Signal from ${socket.id} to ${data.to}`);
            if (peers[data.to]) {
                peers[data.to].emit('signal', {
                    from: socket.id,
                    signal: data.signal
                });
            }
        } else {
            // Broadcast initial offer to all other peers
            console.log(`Broadcasting signal from ${socket.id}`);
            for (let peerId in peers) {
                if (peerId !== socket.id) {
                    peers[peerId].emit('signal', {
                        from: socket.id,
                        signal: data.signal
                    });
                }
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
        delete peers[socket.id];
    });
});
