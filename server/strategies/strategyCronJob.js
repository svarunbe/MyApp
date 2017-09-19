var express = require('express');
var CronJob = require('cron').CronJob;
var SMA = require('technicalindicators').SMA;
var roundTo = require('round-to');
var MACD = require('technicalindicators').MACD;
var EMA = require('technicalindicators').EMA;
var ATR = require('technicalindicators').ATR;
var ADX = require('technicalindicators').ADX;
let KST = require('technicalindicators').KST
var socketPort = require('../modules/socketConnection.js');
let mongo = require('../modules/mongoConnection.js');
var KiteTicker = require("kiteconnect").KiteTicker;
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
    var resultArrayPattern = {
        'high':[],
        'low':[],
        'close':[]
    };
    var resultObjectPattern=[];
    resData.filter(function(val) {
        resultArrayPattern.close.push(val[closing]);
        resultArrayPattern.high.push(val[2]);
        resultArrayPattern.low.push(val[3]);
        resultObjectPattern.push({
            'date':val[0],
            'open':val[1],
            'high':val[2],
            'low':val[3],
            'close':val[4],
            'volume':val[5]
        })
        return;
    });
    callback(resultArrayPattern,resultObjectPattern,strategy);
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
let getADX = function(period,high,low,close){
    var input = {
      high : high,
      low  : low,
      close : close,
      period : period
    }
    return ADX.calculate(input);
}
let getKST = function(period,high,low,close){
    var input = {
      values      : close,
      ROCPer1     : 10,
      ROCPer2     : 15,
      ROCPer3     : 20,
      ROCPer4     : 30,
      SMAROCPer1  : 10,
      SMAROCPer2  : 10,
      SMAROCPer3  : 10,
      SMAROCPer4  : 15,
      signalPeriod: 3
    };
    return KST.calculate(input)
}
let getEMA=function(data,period){
    return EMA.calculate({period : period, values : data});     
}

let getShares = function(job, fn) {

    mongo.connection((db) => {
        db.collection('shares').find().toArray(function(err, result) {
            if (err) throw err;
            _global.shares = result;
            kiteControl.historical(result[0].token, "2017-08-24", "2017-09-19", "5minute")
                .then(function(response) {
                    //console.log(response);
                    var len = response.data.candles.length;
                    //var responceWithTR=fn.calculateTrueRange(response.data.candles);
                    //console.log(response.data.candles[len - 1]);
                    fn.generateData(response.data.candles, 4, _global.shares[0].strategy, function(resArr,resObj,strategy) {
                        


                        if (strategy == "macd") {
                            var macdOutput = fn.getMACD(resArr.close,5,8);
                            var ema_2_days=fn.getEMA(resArr.close,2);
                            var ema_5_days=fn.getEMA(resArr.close,5);
                            var avgTrueRange=fn.averageTrueRange(7,resArr.high,resArr.low,resArr.close);
                            var arr_adx=fn.getADX(7,resArr.high,resArr.low,resArr.close);
                            var kstArr=fn.getKST(7,resArr.high,resArr.low,resArr.close);
                            //console.log(kstArr);
                            var structuredData=fn.createStructure(response.data.candles,macdOutput,ema_2_days,ema_5_days,avgTrueRange,arr_adx,kstArr);                            
                            var flagMacd = "";
                            var flagEma="";
                            var profitMacd = 0;
                            var profitEma = 0;
                            //console.log(structuredData);
                            var trendADX="";
                            var trendEMA="";
                            var trendKST="";
                            for (var i = 0; i < structuredData.length; i++) {
                                var d = new Date(structuredData[i].date);
                                var today = new Date("2017-09-19T09:15:00+0530");
                                if (d.getDate() === today.getDate()) { 
                                    //ADX Strategy
                                   // if(structuredData[i].pdm > structuredData[i].mdm && trendADX!="up"  && structuredData[i].adx > 20){
                                   //  console.log("uptrend ADX"+structuredData[i].date)
                                   //  trendADX="up";
                                   //  profitMacd -= structuredData[i].close;
                                   // }else if(trendADX=="up" && ((structuredData[i].adx-4) < structuredData[i-1].adx)) {  // (structuredData[i].pdm < structuredData[i].mdm && trend!="down"){
                                   //  console.log("downtrend "+structuredData[i].date)
                                   //  trendADX="down";
                                   //  profitMacd += structuredData[i].close;
                                   // }

                                   //EMA strategy
                                    if ((structuredData[i].ema_2_days > structuredData[i-1].ema_2_days) && (structuredData[i].ema_2_days > structuredData[i].ema_5_days) && trendEMA!="up" && (structuredData[i].adx > structuredData[i-1].adx) && (structuredData[i].pdm > structuredData[i].mdm)) {
                                        console.log("uptrend EMA"+structuredData[i].date+ " "+structuredData[i].close)
                                        trendEMA = "up";
                                        profitEma -= structuredData[i].close;
                                    } else if ((structuredData[i].ema_2_days < structuredData[i-1].ema_2_days) && (structuredData[i].ema_2_days < structuredData[i].ema_5_days || structuredData[i].pdm < (structuredData[i].adx-5) ) && trendEMA=="up") {
                                        console.log("downtrend EMA"+structuredData[i].date+" "+structuredData[i].close)
                                        trendEMA = "down";
                                        profitEma += structuredData[i].close;
                                    }
                                   //KST strategy
                                   if(structuredData[i].kstSignal!=undefined && structuredData[i].kst > structuredData[i].kstSignal && structuredData[i].kst > 0 && trendKST!="up") {
                                        console.log("uptrend KST"+structuredData[i].date+ " "+structuredData[i].close)
                                        trendKST = "up";
                                        profitMacd -= structuredData[i].close;
                                   }else if(structuredData[i].kstSignal!=undefined && structuredData[i].kst < structuredData[i].kstSignal && trendKST=="up"){
                                        console.log("downtrend KST"+structuredData[i].date+" "+structuredData[i].close)
                                        trendKST = "down";
                                        profitMacd += structuredData[i].close;
                                   }


                               }
                            }
                            console.log("total profit KST" + profitMacd  + " total profit Ema " + profitEma);
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
let createStructure=function(data,macd,ema_2_days,ema_5_days,atr,adx,kst){
    data=data.reverse();
    macd=macd.reverse();
    ema_2_days=ema_2_days.reverse();
    ema_5_days=ema_5_days.reverse();
    adx=adx.reverse();
    var newData=[];
    for(var i=0;i<data.length;i++){
        if(macd[i] && ema_2_days[i] && ema_5_days[i] && atr[i] && adx[i] && kst[i]){
            var currentPrice=(data[i][1]+data[i][2]+data[i][3]+data[i][4])/4;
            var Previous_Close=data[i]
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
            'adx':adx[i].adx,
            'pdm':adx[i].pdi,
            'mdm':adx[i].mdi,
            'kst':kst[i].kst,
            'kstSignal':kst[i].signal
         });    
        }else{
            i=data.length;
        }    
    }
    return newData.reverse();
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
    'getADX':getADX,
    'getKST':getKST
    //'getAccessToken':getAccessToken
};