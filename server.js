const express = require("express");
const WebSocket = require("ws");

const app = express();
let totalClicks = 0;

app.use('/static', express.static('node_modules'));

app.use(express.static("views"));

app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("index", { counter: totalClicks });
});

app.listen(8888, () => {
    console.log("Server is running on http://localhost:8888");
});

const wss = new WebSocket.Server({ port: 3002 });

wss.on('connection', function (ws) {
    // Send the current click count to the client on connection
    ws.send(totalClicks);

    ws.on('message', function (message) {
        if (message === 'increment') {
            totalClicks++;

            // Broadcast the updated count to all connected clients
            wss.clients.forEach(function (client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(totalClicks);
                }
            });
        }
    });

    ws.on('close', function () {
        console.log('Client disconnected');
    });
});
