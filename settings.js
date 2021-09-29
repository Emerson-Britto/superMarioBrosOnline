const express = require('express')
const app = express()
const path = require('path')

const http = require('http')

const server = http.createServer(app)

const socketio = require('socket.io')
const io = socketio(server)

app.set('view engine', 'ejs')
app.use('/public', express.static('public'))

let game = 'Super Mario Bros Online'

app.get('/', function(req, res){
    res.render('index', {name: game, root: path.resolve(path.dirname(''))})
})

app.get('/play', function(req, res){
    res.render('play', {name: game, root: path.resolve(path.dirname(''))})
})

let users = 0;

io.on('connection', (socket) => {
    users++;

    io.sockets.emit('login', {users, id: socket.id});

    socket.on('disconnect', () =>{
        users--;
        io.sockets.emit('logout', {users, id: socket.id});
    })

    socket.on('keypress', (event) => {
        io.sockets.emit('keypressed', event);
    })

    socket.on('player_movement', (action) => {
        io.sockets.emit('player_move', {action, users});
    })

    
})


server.listen(80)