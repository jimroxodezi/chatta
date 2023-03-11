
const ws = new WebSocket("ws://localhost:3001");

const userName = localStorage.getItem('username') || 
                prompt("What's your username?") || "anonym";

localStorage.setItem("username", userName);


ws.addEventListener("open", () => {
    console.log("websocket connection established.");
})

function addToChatBox({sender, message}) {
    const div = document.createElement('div');
    div.className = "message-row";

    const senderDiv = document.createElement('div');
    senderDiv.className = "sender";
    const messageDiv = document.createElement('div');
    messageDiv.className = "message";

    senderDiv.textContent = `${sender}:`;
    messageDiv.textContent = message;

    div.appendChild(senderDiv);
    div.appendChild(messageDiv);

    document.getElementById('chat').appendChild(div);
}

ws.addEventListener("message", (e) => {
    // console.log(`Client socket says: ${e.data}`);
    try {
        const msg = JSON.parse(e.data);
        const {sender, message} = msg;
        addToChatBox({sender, message})
    } catch (error) {
        throw new Error(`failed because of: ${error}`)
    }
})

function runHandler(e) {
    e.preventDefault();

    if (ws.readyState === WebSocket.OPEN) {
        const field = document.getElementById('message-field');
        const message = field.value;

        field.value = "";

        console.log(`Trying to send message: ${message}`);
        ws.send(JSON.stringify({
            sender: userName,
            message
        }));
    }else {
        console.log("Still establishing connection");
    }
    
}