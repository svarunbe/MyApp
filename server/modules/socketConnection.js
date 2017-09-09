let express = require('express');
let mongo = require('./mongoConnection.js');
let socket={
    "socketIO":''
}
_global={
          "socketId":''       
};
let listenToSocket = (io) => {
    socket.socketIO=io;
    io.on('connection',  (socket) => {      
      mongo.connection((db) => {
            db.collection('users').update({'collection.name':'vijay'},{$set:{'collection.socketId':socket.id}});
      });
      _global.socketId=socket.id;
      io.to(socket.id).emit('news', { hello: 'world' });
    });
    /*socket.on('add-message', (data) => {
        console.log(data);
    });*/
};

let emitEventToClient =(socket_id,message)=>{
    socket.socketIO.to(socket_id).emit('news', { hello: message });
}
module.exports = {
    'listenToSocket':listenToSocket,
    'emitEventToClient':emitEventToClient
};
