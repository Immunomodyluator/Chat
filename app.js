const express = require('express')
const http = require('http')
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server)
const PORT = 80

app.use(express.static("public"))

server.listen(PORT, () => {
    console.log(`listening on: ${PORT}`)
})

let users = []

io.on('connection', (socket) => {
    let ID = (socket.id).toString().slice(1,6)
    console.log(`${ID} connected`)
    users.push({id: ID});

    socket.on('chat message', (msg) => {
        io.emit('chat message', `${ID}: ${msg}`);
        console.log('message: ' + `${ID}: ${msg}`);
    })

    socket.on('disconnect', () => {
        let obIndex = users.findIndex(item => item.id === ID)
        users.splice(obIndex, 1)
        console.log(`${ID} disconnected`)
    })

    let usersHTML = "";
    for (let key in users) {
        usersHTML = usersHTML + `<div>id ${users[key].id}</div>`
    }
    io.emit('usersHTML', usersHTML);
})


