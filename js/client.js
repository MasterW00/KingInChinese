var Client = {};
let clientID;
Client.socket = io.connect();
Client.askNewPlayer = function(){
    Client.socket.emit('joinask');
    console.log('asking server for life');
}
Client.socket.on('newplayer',function(data){
    console.log(data);
    window.myScene.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allplayers',function(data){
    
});

Client.socket.on('remove',function(id){
    window.myScene.removePlayer(id);
});
Client.sendSword = function(id, sword){
    Client.socket.emit('sword', {id:id, sword:sword});
}
Client.socket.on('sword', function(data){
    window.myScene.moveSword(data.id, data.sword);
});
Client.sendMove = function(id, x, y, angle){
    Client.socket.emit('move', {id:id,x:x,y:y,angle:angle})
}
Client.socket.on('go', function(data){
    if(data.id == clientID){
        return;
    }
    window.myScene.movePlayer(data.id, data.x, data.y, data.angle);
});
Client.socket.on('access',function(data){    
    clientID =  data.id;
    console.log(data.PlayerList);
    for(var i = 0; i < data.PlayerList.length; i++){
        window.myScene.addNewPlayer(data.PlayerList[i].id,data.PlayerList[i].x,data.PlayerList[i].y,data.PlayerList[i].angle);
    }
})
