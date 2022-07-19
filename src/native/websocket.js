const WebSocket = require('ws')

process.on('message', (webSocketServer) => {
  const ws = new WebSocket(webSocketServer)

  ws.onmessage = (event) => {
    process.stdout.write('\033c');
    const obj = JSON.parse(event.data);
    console.log(obj)
    process.send(obj)
  }
})