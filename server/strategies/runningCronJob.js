var express = require('express');
var CronJob = require('cron').CronJob;
var SMA = require('technicalindicators').SMA;
var roundTo = require('round-to');
var MACD = require('technicalindicators').MACD;
let mongo = require('../modules/mongoConnection.js');
//var socketPort = require('../modules/socketConnection.js');
let getShares=function(){
  mongo.connection((db) => {
    var result=  db.collection('shares').find().toArray(function(err, result) {
    if (err) throw err;
    console.log(result[0].data);
    db.close();
    });
  });
}
let runCronJob= function(){
  
  var job = new CronJob({
        cronTime: '5 * * * * *',
        onTick: function() {
           // var data=getFn.generateData(4);        
           // var result=getFn.getMACD(data,5,8);
           // var len=result.length-1;
           // var macd=roundTo(result[len].MACD,2);
           // var signal=roundTo(result[len].signal,2);
           // if( macd > signal){
           //  if(_global.socketId){
           //      socketPort.emitEventToClient(_global.socketId,"signal",{"name":"REL","status":"buy"});    
           //  }
           //  console.log(macd,signal);      
           // }
            //getFn.kiteLogin();
            
            fn.kt.margins("equity")
            .then(function(response) {
                console.log(response);
                // You got user's margin details.
            }).catch(function(err) {
                console.log(err);
                // Something went wrong.
            });
         },
         start: false,
         timeZone: 'America/Los_Angeles'
        });
    job.start();
}

module.exports = {
    'getShares':getShares,
   
};
