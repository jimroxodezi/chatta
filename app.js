const express = require("express");
const {WebSocketServer, WebSocket} = require("ws");

const PORT = 3000;
const app = express();

const wss = new WebSocketServer({
    port: 3001,
    clientTracking: true,
});

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
  
    ws.on('message', function message(data) {
        try {
            const _message = Buffer.from(data).toString();
            const {sender, message} = JSON.parse(_message);
            // console.log(wss.clients);

            for (const client of wss.clients) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        sender,
                        message
                    }));
                }
            }
        }catch (error) {
            throw new Error(`Oopsie: ${error}`);
        }
    });
  
    ws.send(JSON.stringify({
        sender: "system",
        message: "connection established"
    }));
});

// app.get("/", (req, res) => {
//     res.send(Buffer.from("Hello there!\n", "utf-8"));
// });

app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}\n`);
});