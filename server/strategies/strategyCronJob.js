var express = require('express');
var CronJob = require('cron').CronJob;
var SMA = require('technicalindicators').SMA;
var roundTo = require('round-to');
var MACD = require('technicalindicators').MACD;
var EMA = require('technicalindicators').EMA;
var ATR = require('technicalindicators').ATR;
var ADX = require('technicalindicators').ADX;
var KST = require('technicalindicators').KST;
var RSI = require('technicalindicators').RSI;
var ForceIndex = require('technicalindicators').ForceIndex;
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
        'high': [],
        'low': [],
        'close': [],
        'volume':[]
    };
    var resultObjectPattern = [];
    resData.filter(function(val) {
        resultArrayPattern.close.push(val[closing]);
        resultArrayPattern.high.push(val[2]);
        resultArrayPattern.low.push(val[3]);
        resultArrayPattern.volume.push(val[5]);
        resultObjectPattern.push({
            'date': val[0],
            'open': val[1],
            'high': val[2],
            'low': val[3],
            'close': val[4],
            'volume': val[5]
        })
        return;
    });
    callback(resultArrayPattern, resultObjectPattern, strategy);
}
let averageTrueRange = function(period, high, low, close) {
    var input = {
        high: high,
        low: low,
        close: close,
        period: period
    }
    return ATR.calculate(input);
}
let getMACD = function(data, fastPeriod, slowPeriod) {
    var macdInput = {
        values: data,
        fastPeriod: fastPeriod,
        slowPeriod: slowPeriod,
        signalPeriod: 7,
        SimpleMAOscillator: false,
        SimpleMASignal: false
    }
    return MACD.calculate(macdInput);
}
let getADX = function(period, high, low, close) {
    var input = {
        high: high,
        low: low,
        close: close,
        period: period
    }
    return ADX.calculate(input);
}
let getRSI = function(period, close) {
    var inputRSI = {
        values: close,
        period: period
    };
    return RSI.calculate(inputRSI)
}
let getForceIndex = function(period, close,volume) {

    var inputFI = {
        close: close,
        volume:volume,
        period: period
    };
    return ForceIndex.calculate(inputFI)
}

let getKST = function(period, high, low, close) {
    var input = {
        values: close,
        ROCPer1: 5,
        ROCPer2: 10,
        ROCPer3: 15,
        ROCPer4: 20,
        SMAROCPer1: 5,
        SMAROCPer2: 10,
        SMAROCPer3: 15,
        SMAROCPer4: 20,
        signalPeriod: 9
    };
    return KST.calculate(input)
}
let getEMA = function(data, period) {
    return EMA.calculate({ period: period, values: data });
}

let getShares = function(job, fn) {

    mongo.connection((db) => {
        db.collection('shares').find().toArray(function(err, result) {
            if (err) throw err;
            _global.shares = result;
            var date = new Date();

            var todayDate = date.getFullYear() + '-' +
                ((date.getMonth() + 1).toString().length == 1 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) +
                '-' + date.getDate();
            var lastDate = new Date(date.setDate(date.getDate() - 29));

            lastDate = lastDate.getFullYear() + '-' +
                ((lastDate.getMonth() + 1).toString().length == 1 ? '0' + (lastDate.getMonth() + 1) : (lastDate.getMonth() + 1)) +
                '-' + lastDate.getDate();

            kiteControl.historical(result[1].token, lastDate, todayDate, "5minute")
                .then(function(response) {
                    fn.generateData(response.data.candles, 4, _global.shares[0].strategy, function(resArr, resObj, strategy) {
                        
                        var structuredData=fn.createStructure(response.data.candles,resArr,fn);
                        var profitMacd = 0,
                            trendmacd = "";
                        for (var i = 0; i < structuredData.length; i++) {
                                var d = new Date(structuredData[i].date);
                                var today = new Date("2017-09-27T09:15:00+0530");
                                if (d.getDate() == today.getDate()) {
                                    if (strategy == "macd") {
                                    
                                    if (trendmacd != "up" 
                                        //&& structuredData[i].forceIndex > 0 
                                        && structuredData[i].adx > 20 
                                        && structuredData[i].adx > structuredData[i-1].adx
                                        && structuredData[i].pdm > structuredData[i].mdm
                                        && structuredData[i].rsi > 20 
                                        && structuredData[i].kst > structuredData[i].kstSignal 
                                        && structuredData[i].macd > 0 
                                        && structuredData[i].macd > structuredData[i].signal) {
                                        console.log("buy " + structuredData[i].date);
                                        trendmacd = "up";
                                        profitMacd -= structuredData[i].close;
                                    } else if (trendmacd == "up" 
                                        && structuredData[i].kst < structuredData[i].kstSignal) {
                                        console.log("sell " + structuredData[i].date);
                                        trendmacd = "down";
                                        profitMacd += structuredData[i].close;
                                    }
                                    /*buy signal*/
                                    // FI > 0
                                    // adx > 30  && adx > 
                                    // macd > signal && macd > 0
                                    // kst > 0 && kast >  kstSignal
                                    // rsi < 50

                                    /*sell signal signal*/
                                    // kast <  kstSignal
                                    
                                }
                            }
                        }
                        console.log(profitMacd);
                    });
                })
                .catch(function(err) {
                    console.log("err getting historical data " + err);
                });
            //job.start();
            db.close();
        });
    });
}
let createStructure = function(candles,resArr,fn) {
    var macd = fn.getMACD(resArr.close, 5, 10),
        ema_2_days = fn.getEMA(resArr.close, 2),
        ema_5_days = fn.getEMA(resArr.close, 5),
        rsi = fn.getRSI(7, resArr.close),
        //avgTrueRange = fn.averageTrueRange(7, resArr.high, resArr.low, resArr.close),
        adx = fn.getADX(7, resArr.high, resArr.low, resArr.close),
        kst = fn.getKST(7, resArr.high, resArr.low, resArr.close),
        forceIndex =fn.getForceIndex(7,resArr.close,resArr.volume),
        macd = macd.reverse(),
        ema_2_days = ema_2_days.reverse(),
        ema_5_days = ema_5_days.reverse(),
        adx = adx.reverse(),
        rsi = rsi.reverse(),
        kst =kst.reverse(),
        candles=candles.reverse();
    /*return {
        'date': candles[candles.length-1][0],
        'open': candles[candles.length-1][1],
        'high': candles[candles.length-1][2],
        'low': candles[candles.length-1][3],
        'close': candles[candles.length-1][4],
        'volume': candles[candles.length-1][5],
        'macd': macd.MACD,
        'signal': macd.signal,
        'ema_2_days': ema_2_days,
        'ema_5_days': ema_5_days,
        'adx': adx.adx,
        'pdm': adx.pdi,
        'mdm': adx.mdi,
        'kst': kst.kst,
        'kstSignal': kst.signal,
        'rsi': rsi
    }*/

    var newData=[];
    for(var i=0;i<candles.length;i++){
        if(macd[i] && ema_2_days[i] && ema_5_days[i] && adx[i] && rsi[i] && kst[i] && forceIndex[i]){
            
            newData.push({
            'date':candles[i][0],
            'open':candles[i][1],
            'high':candles[i][2],
            'low':candles[i][3],
            'close':candles[i][4],
            'volume':candles[i][5],
            'macd':macd[i].MACD,
            'signal':macd[i].signal,
            'ema_2_days':ema_2_days[i],
            'ema_5_days':ema_5_days[i],
            'adx': adx[i].adx,
            'pdm': adx[i].pdi,
            'mdm': adx[i].mdi,
            'kst': kst[i].kst,
            'kstSignal': kst[i].signal,
            'rsi': rsi[i],
            'forceIndex':forceIndex[i]
         });    
        }else{
            i=candles.length;
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
    'getEMA': getEMA,
    'generateData': generateData,
    'kiteLogin': kiteLogin,
    //'getHistoricalData':getHistoricalData,
    'getShares': getShares,
    'checkKiteAccessToken': checkKiteAccessToken,
    'createStructure': createStructure,
    'averageTrueRange': averageTrueRange,
    'getADX': getADX,
    'getKST': getKST,
    'getRSI': getRSI,
    'getForceIndex':getForceIndex
    //'getAccessToken':getAccessToken
};