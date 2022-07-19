const WebSocket = require('ws')

process.on('message', () => {
  // const ws = new WebSocket("wss://bardemu-backend.herokuapp.com/")
  const ws = new WebSocket("ws://localhost:5050")

  ws.onmessage = (event) => {
    process.stdout.write('\033c');
    const obj = JSON.parse(event.data);
    console.log(obj)
    process.send(obj)
  }
})