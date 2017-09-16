var express = require('express');
var CronJob = require('cron').CronJob;
var SMA = require('technicalindicators').SMA;
var roundTo = require('round-to');
var MACD = require('technicalindicators').MACD;
let mongo = require('../modules/mongoConnection.js');
var list = require('./strategyCronJob.js');

let getAccessToken=function(){
    mongo.connection((db) => {
    db.collection('users').find({"name":"vijay"}).toArray(function(err, result) {
        if (err) throw err;
            //console.log(result);
            //return result;
            list.checkKiteAccessToken(result[0].accessToken);
            //db.close();
    });
 });
}

let runCronJob= function(){
  //list.getAccessToken();
  //list.checkKiteAccessToken();
  var job = new CronJob({
        cronTime: '*/10 * * * * *',
        onTick: function() {

            //console.log(1);
            //_global.shares;
           // var data=getFn.generateData(4);        
           // var result=getFn.getMACD(data,5,8);
           // var len=result.length-1;
           
            //getFn.kiteLogin();
            
         },
         start: false,
         timeZone: 'America/Los_Angeles'
  });
  
  list.kiteLogin(_global.access_token,job,list);
}

module.exports = {
    'runCronJob':runCronJob,
    'getAccessToken':getAccessToken
};
