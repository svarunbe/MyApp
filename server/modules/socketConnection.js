var express = require('express');
var mongo = require('./mongoConnection.js');
var listenSocket = (io) => {
    io.on('connection', function (socket) { 
      mongo.connection((db) => {
            db.collection('users').update({'name':'vijay'},{$set:{'socketId':socket.id}});
        });
      
      io.to(socket.id).emit('news', { hello: 'world' });
      socket.on('add-message', function (data) {
        console.log(data);
      });
    });
};

module.exports = {
    'listenSocket':listenSocket
};
