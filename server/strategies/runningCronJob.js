var express = require('express');
var CronJob = require('cron').CronJob;
var SMA = require('technicalindicators').SMA;
var roundTo = require('round-to');
var MACD = require('technicalindicators').MACD;
//var socketPort = require('../modules/socketConnection.js');

var marketdata={
    "status": "success",
    "data": {
        "candles": [
            ["2015-12-28T09:15:00+0530", 1386.4, 1388, 1381.05, 1385.1, 788],
            ["2015-12-28T09:16:00+0530", 1385.1, 1389.1, 1383.85, 1385.5, 609],
            ["2015-12-28T09:17:00+0530", 1385.5, 1387, 1385.5, 1385.7, 212],
            ["2015-12-28T09:18:00+0530", 1387, 1387.95, 1385.3, 1387.95, 1208],
            ["2015-12-28T09:19:00+0530", 1387, 1387.55, 1385.6, 1386.25, 716],
            ["2015-12-28T09:20:00+0530", 1386.95, 1389.95, 1386.95, 1389, 727],
            ["2015-12-28T09:21:00+0530", 1389, 1392.95, 1389, 1392.95, 291],
            ["2015-12-28T09:22:00+0530", 1392.95, 1393, 1392, 1392.95, 180],
            ["2015-12-28T09:23:00+0530", 1392.95, 1393, 1392, 1392.15, 1869],
            ["2016-01-01T13:22:00+0530", 1386.4, 1388, 1381.05, 1385.1, 788],
            ["2016-01-01T13:23:00+0530", 1385.1, 1389.1, 1383.85, 1385.5, 613],
            ["2016-01-01T13:24:00+0530", 1385.5, 1387, 1385.5, 1385.7, 212],
            ["2016-01-01T13:25:00+0530", 1387, 1387.95, 1385.3, 1387.95, 1208],
            ["2016-01-01T13:26:00+0530", 1387, 1387.55, 1385.6, 1386.25, 716],
            ["2016-01-01T13:27:00+0530", 1386.95, 1389.95, 1386.95, 1389, 727],
            ["2016-01-01T13:28:00+0530", 1389, 1392.95, 1389, 1392.95, 291],
            ["2016-01-01T13:29:00+0530", 1392.95, 1393, 1392, 1392.95, 180],
            ["2016-01-01T13:30:00+0530", 1392.95, 1393, 1392, 1392.15, 1869]
        ]
    }
}


let startCronJob=function(){
    //console.log(this.generateData(4));
    var getFn={
                simpleMovingAvg:this.simpleMovingAvg,
                generateData:this.generateData,
                getMACD:this.getMACD,
                roundToDecimalPlaces:this.roundToDecimalPlaces
            };
    var job = new CronJob({
        cronTime: '5 * * * * *',
        onTick: function() {
           var data=getFn.generateData(4);        
           var result=getFn.getMACD(data,5,8);
           var len=result.length-1;
           var macd=roundTo(result[len].MACD,2);
           var signal=roundTo(result[len].signal,2);
           if( macd > signal){
            if(_global.socketId){
                socketPort.emitEventToClient(_global.socketId,"signal",{"name":"REL","status":"buy"});    
            }
            console.log(macd,signal);      
           }
         },
         onComplete:function(){
          console.log("completed");
         },
         start: false,
         timeZone: 'America/Los_Angeles'
    });
    job.start();
}
let generateData=function(closing){
    var result=[];
    marketdata.data.candles.filter(function(val){
        result.push(val[closing]);
        return;
    });
    return result;
}
let getMACD=function(data,fastPeriod,slowPeriod){
    var macdInput = {
      values            : data,
      fastPeriod        : fastPeriod,
      slowPeriod        : slowPeriod,
      signalPeriod      : 3,
      SimpleMAOscillator: false,
      SimpleMASignal    : false
    }
    return MACD.calculate(macdInput);
}

let simpleMovingAvg=function(marketdata,getFn){
    var prices = [1,2,3,4,5,6,7,8,9,10,12,13,15];
    var period = 10;
    var result=SMA.calculate({period : period, values : prices});
    console.log(result);
}

let exponiatialMovingAvg=function(){

}
module.exports = {
    'startCronJob':startCronJob,
    'simpleMovingAvg':simpleMovingAvg,
    'getMACD':getMACD,
    'generateData':generateData
};
