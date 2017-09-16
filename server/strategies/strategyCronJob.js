var express = require('express');
var CronJob = require('cron').CronJob;
var SMA = require('technicalindicators').SMA;
var roundTo = require('round-to');
var MACD = require('technicalindicators').MACD;
var EMA = require('technicalindicators').EMA;
var ATR = require('technicalindicators').ATR;
var socketPort = require('../modules/socketConnection.js');
let mongo = require('../modules/mongoConnection.js');
var KiteTicker = require("kiteconnect").KiteTicker;

/*var marketdata={
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
*/
let kiteLogin = function(session_token, job, fn) {
    //https://kite.trade/connect/login?api_key=vbpw084agezv9xvp
    //getShares(job);
    kiteControl.requestAccessToken(session_token, "1ogeryewziiava62tj3iwkscjzv4ke10")
        .then(function(response) {
            init(response.data.access_token, response.data.user_id, response.data.public_token);
        })
        .catch(function(err) {
            console.log(err.response);
        })

    function init(access_token, user_id, public_token) {
        // Fetch equity margins.
        // You can have other api calls here.
        _global.access_token = access_token;
        _global.user_id = user_id;
        _global.public_token = public_token;
        kiteControl.setAccessToken(access_token);
        fn.getShares(job, fn);
    }
}
let generateData = function(resData, closing, strategy, callback) {
    var result = {
        'high':[],
        'low':[],
        'close':[]
    };
    resData.filter(function(val) {
        result.close.push(val[closing]);
        result.high.push(val[2]);
        result.low.push(val[3]);
        return;
    });
    callback(result, strategy);
}
let averageTrueRange=function(period,high,low,close){
    var input = {
      high : high,
      low  : low,
      close : close,
      period : period
    }
    return ATR.calculate(input);
}
let getMACD = function(data, fastPeriod, slowPeriod) {
    var macdInput = {
        values: data,
        fastPeriod: fastPeriod,
        slowPeriod: slowPeriod,
        signalPeriod: 3,
        SimpleMAOscillator: false,
        SimpleMASignal: false
    }
    return MACD.calculate(macdInput);
}
let getEMA=function(data,period){
    return EMA.calculate({period : period, values : data});     
}
let getShares = function(job, fn) {

    mongo.connection((db) => {
        db.collection('shares').find().toArray(function(err, result) {
            if (err) throw err;
            _global.shares = result;
            kiteControl.historical(result[0].token, "2017-08-19", "2017-09-16", "15minute")
                .then(function(response) {
                    //console.log(response);
                    var len = response.data.candles.length;
                    //console.log(response.data.candles[len - 1]);
                    fn.generateData(response.data.candles, 4, _global.shares[0].strategy, function(res, strategy) {
                        //console.log(res,strategy);
                        if (strategy == "macd") {
                            var macdOutput = fn.getMACD(res.close,5,8);
                            var ema_2_days=fn.getEMA(res.close,2);
                            var ema_5_days=fn.getEMA(res.close,5);
                            var avgTrueRange=fn.averageTrueRange(7,res.high,res.low,res.close);
                            var structuredData=fn.createStructure(response.data.candles,macdOutput,ema_2_days,ema_5_days,avgTrueRange,fn.superTrend);
                            
                            var flagMacd = "";
                            var flagEma="";
                            var profitMacd = 0;
                            var profitEma = 0;
                            for (var i = 0; i < structuredData.length; i++) {
                                var d = new Date(structuredData[i].date);
                                var today = new Date("2017-09-15T09:15:00+0530");
                                if (d.getDate() == today.getDate()) {

                                    if(structuredData[i].superTrend){
                                        console.log("buy at superTrend" + structuredData[i].close +" "+d);
                                    }
                                    //console.log(structuredData[i].macd,structuredData[i].signal,structuredData[i].ema_2_days,structuredData[i].ema_5_days);
                                    /*if ((structuredData[i].ema_2_days > structuredData[i].ema_5_days) && (structuredData[i].macd > structuredData[i].signal) && (flagMacd == "buy" || flagMacd == "")) {
                                        console.log("buy at macd" + structuredData[i].close +" "+d);
                                        flagMacd = "sell";
                                        profitMacd -= structuredData[i].close;
                                    } else if (structuredData[i].macd < structuredData[i].signal && flagMacd == "sell") {
                                        console.log("sell at macd" + structuredData[i].close+" "+d);
                                        flagMacd = "buy";
                                        profitMacd += structuredData[i].close;
                                    }*/

                                   /* if ((structuredData[i].ema_2_days > structuredData[i].ema_5_days) && (flagEma == "buy" || flagEma == "")) {
                                        console.log("buy at Ema" + structuredData[i].close +" "+d);
                                        flagEma = "sell";
                                        profitEma -= structuredData[i].close;
                                    } else if (structuredData[i].macd < structuredData[i].signal && flagEma == "sell") {
                                        console.log("sell at Ema" + structuredData[i].close+" "+d);
                                        flagEma = "buy";
                                        profitEma += structuredData[i].close;
                                    }*/
                               }
                            }
                            console.log("total profit " + profitMacd  + " total profit Ema " + profitEma);
                        }

                    });
                })
                .catch(function(err) {
                    console.log(err);
                });
            //result[0].
            //job.start();
            db.close();
        });
    });
}
let createStructure=function(data,macd,ema_2_days,ema_5_days,atr,superTrend){
    data=data.reverse();
    macd=macd.reverse();
    ema_2_days=ema_2_days.reverse();
    ema_5_days=ema_5_days.reverse();
    atr=atr.reverse();
    var newData=[];
    for(var i=0;i<data.length;i++){
        if(macd[i] && ema_2_days[i] && ema_5_days[i] && atr[i]){
            var currentPrice=(data[i][1]+data[i][2]+data[i][3]+data[i][4])/4;
            var Previous_Close=data[i]
            superTrend(data[i][2],data[i][3],3,atr[i],currentPrice,data[i][4],)
            newData.push({
            'date':data[i][0],
            'open':data[i][1],
            'high':data[i][2],
            'low':data[i][3],
            'close':data[i][4],
            'volume':data[i][5],
            'macd':macd[i].MACD,
            'signal':macd[i].signal,
            'ema_2_days':ema_2_days[i],
            'ema_5_days':ema_5_days[i],
            'superTrend':''
         });    
        }else{
            i=data.length;
        }    
    }
    return newData.reverse();
}

let superTrend=function(HIGH,LOW,Multiplier,ATR,currentPrice,Current_Close,Previous_Close,Previous_UPPERBAND,Previous_LOWERBAND){
    /*
    BASIC UPPERBAND  =  (HIGH + LOW) / 2 + Multiplier * ATR
BASIC LOWERBAND =  (HIGH + LOW) / 2 - Multiplier * ATR

FINAL UPPERBAND = IF( (Current BASICUPPERBAND  < Previous FINAL UPPERBAND) and (Previous Close > Previous FINAL UPPERBAND)) THEN (Current BASIC UPPERBAND) ELSE Previous FINALUPPERBAND)

FINAL LOWERBAND = IF( (Current BASIC LOWERBAND  > Previous FINAL LOWERBAND) and (Previous Close < Previous FINAL LOWERBAND)) THEN (Current BASIC LOWERBAND) ELSE Previous FINAL LOWERBAND)

SUPERTREND = IF(Current Close <= Current FINAL UPPERBAND ) THEN Current FINAL UPPERBAND ELSE Current  FINAL LOWERBAND*/
    var obj= {
        'trend':'lower',
        'UPPERBAND':'',
        'LOWERBAND':''
    }
    var BASIC_UPPERBAND  =  (HIGH + LOW) / 2 + Multiplier * ATR;
    var BASIC_LOWERBAND =  (HIGH + LOW) / 2 - Multiplier * ATR;

    if(!Previous_Close){
        var SUPERTREND=0;
        obj.UPPERBAND=BASIC_UPPERBAND;
        obj.LOWERBAND=BASIC_LOWERBAND;
        if(Current_Close <=BASIC_UPPERBAND){
            SUPERTREND=BASIC_UPPERBAND;
            obj.trend='upper';
            return obj;
        }else{
            SUPERTREND=BASIC_LOWERBAND;
            obj.trend='lower';
            return obj;
        }
    }

    
    if((BASIC_UPPERBAND  < Previous_UPPERBAND) &&  (Previous_Close > Previous_UPPERBAND)){
        obj.UPPERBAND=BASIC_UPPERBAND;
    }else{
        obj.UPPERBAND=Previous_UPPERBAND;
    }

    
    if((BASIC_LOWERBAND  > Previous_LOWERBAND) &&  (Previous_Close < Previous_LOWERBAND)){
        obj.LOWERBAND=BASIC_LOWERBAND;
    }else{
        obj.LOWERBAND=Previous_LOWERBAND;
    }

    var SUPERTREND=0;
    if(Current_Close <=obj.UPPERBAND){
        SUPERTREND=obj.UPPERBAND;
        obj.trend='upper';
        return obj;
    }else{
        SUPERTREND=obj.LOWERBAND;
        obj.trend='lower';
        return obj;
    }

}
let simpleMovingAvg = function(marketdata, getFn) {
    var prices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 15];
    var period = 10;
    var result = SMA.calculate({ period: period, values: prices });
    console.log(result);
}

let checkKiteAccessToken = function(access_token) {
    var fn = {
        "kiteLogin": this.kiteLogin
    }
    kiteControl.margins("equity")
        .then(function(response) {
            console.log(response);
            // You got user's margin details.
        })
        .catch(function(err) {
            console.log(err);
            fn.kiteLogin(access_token); // Something went wrong.
        });
}

module.exports = {
    'simpleMovingAvg': simpleMovingAvg,
    'getMACD': getMACD,
    'getEMA':getEMA,
    'generateData': generateData,
    'kiteLogin': kiteLogin,
    //'getHistoricalData':getHistoricalData,
    'getShares': getShares,
    'checkKiteAccessToken': checkKiteAccessToken,
    'createStructure':createStructure,
    'averageTrueRange':averageTrueRange,
    'superTrend':superTrend
    //'getAccessToken':getAccessToken
};
/*let kiteWebSocket=function(public_token){

var ticker = new KiteTicker("vbpw084agezv9xvp", "RV3206", public_token);

// set autoreconnect with 10 maximum reconnections and 5 second interval
ticker.autoReconnect(true, 10, 5)
ticker.connect();
ticker.on("tick", setTick);
ticker.on("connect", subscribe);

ticker.on("noreconnect", function() {
    console.log("noreconnect")
});

ticker.on("reconnecting", function(reconnect_interval, reconnections) {
    console.log("Reconnecting: attempet - ", reconnections, " innterval - ", reconnect_interval);
});

function setTick(ticks) {
    console.log("Ticks", ticks);
}

function subscribe() {
    var items = [738561];
    ticker.subscribe(items);
    ticker.setMode(ticker.modeFull, items);
}
}*/