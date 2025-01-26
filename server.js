const { Console } = require('console');
var express = require('express');
const { CLIENT_RENEG_LIMIT } = require('tls');
var app = express();
var server = require('http').Server(app);
var { Server } = require('socket.io');
var io = new Server(server);
var clientList = [];

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.lastPlayderID = 0;

server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+server.address().port);
});

io.on('connection',function(socket){

    socket.on('joinask',function(){
        var clientID;
        //determine ID
        if (clientList.length >= 8999){
            clientID = 10000 + clientList.length - 8999;
        }
        else{
        for(let i = clientList.length, x = randomInt(1000, 9999); i >= 0; i-- ){
            if(x != clientList[i]){
                clientID = x;
            }
            else{
                x = randomInt(1000, 9999);
                i = clientList.length;
            }
            
        }}
        //create new socket player object
        socket.player = {
            id: clientID,
            x: randomInt(50,800),
            y: randomInt(50,800)
        };
        clientList.push(socket.player.id);
        socket.emit('access', {id:socket.player.id, PlayerList:getAllPlayers()});
        console.log('player joined with ID:' + socket.player.id);
        console.log('creating new player');
        console.log();
        socket.broadcast.emit('newplayer',socket.player);

        // click baised movement
        // socket.on('click',function(data){
        //     console.log('click to '+data.x+', '+data.y);
        //     socket.player.x = data.x;
        //     socket.player.y = data.y;
        //     io.emit('move',socket.player);
        // });
        socket.on('move', function(data){
            socket.player.x = data.x;
            socket.player.y = data.y;
            socket.player.angle = data.angle;
            socket.broadcast.emit('go',data);
        });
        socket.on('sword',function(data){
            socket.broadcast.emit('sword',data);
        });

        socket.on('disconnect',function(){
            
            for (let i = 0; i < clientList.length; i++) {
                if (clientList[i] == socket.player.id) {
                    clientList.splice(i, 1); // Remove the player from the list
                    break;
                }
            }
            console.log('player ' + socket.player.id + ' left');
            io.emit('remove',socket.player.id);
            console.log('Connected Players\n' + clientList.toString()+'\n');
        });
    });

    socket.on('test',function(){
        console.log('test received');
    });
});
function getAllPlayers() {
    let players = [];
    for (let [id, socket] of io.of("/").sockets) {
        if (socket.player) {
            players.push(socket.player);
        }
    }
    return players;
}
function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}