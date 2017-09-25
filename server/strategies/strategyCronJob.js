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
        'close': []
    };
    var resultObjectPattern = [];
    resData.filter(function(val) {
        resultArrayPattern.close.push(val[closing]);
        resultArrayPattern.high.push(val[2]);
        resultArrayPattern.low.push(val[3]);
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

            kiteControl.historical(result[2].token, lastDate, todayDate, "15minute")
                .then(function(response) {
                    fn.generateData(response.data.candles, 4, _global.shares[0].strategy, function(resArr, resObj, strategy) {
                        if (strategy == "macd") {
                                var profitMacd = 0,
                                trendmacd = "";

                                if (trendmacd != "up" && structuredData.adx > 20 && structuredData.rsi < 30 && structuredData.kst > structuredData.kstSignal && structuredData.macd > 0 && structuredData.macd > structuredData.signal) {
                                    console.log("buy " + structuredData.date);
                                    trendmacd = "up";
                                    profitMacd -= structuredData.close;
                                } else if (trendmacd == "up" && structuredData.kst < structuredData.kstSignal) {
                                    console.log("sell " + structuredData.date);
                                    trendmacd = "down";
                                    profitMacd += structuredData.close;
                                }
                                /*buy signal*/
                                // adx > 30
                                // macd > signal && macd > 0
                                // kst > 0 && kast >  kstSignal
                                // rsi < 30

                                /*sell signal signal*/
                                // kast <  kstSignal
                                console.log(profitMacd);
                        }
                    });
                })
                .catch(function(err) {
                    console.log(err);
                });
            //job.start();
            db.close();
        });
    });
}
let createStructure = function(data,) {
    var macdOutput = fn.getMACD(resArr.close, 5, 10),
        ema_2_days = fn.getEMA(resArr.close, 2),
        ema_5_days = fn.getEMA(resArr.close, 5),
        arr_rsi = fn.getRSI(7, resArr.close),
        avgTrueRange = fn.averageTrueRange(7, resArr.high, resArr.low, resArr.close),
        arr_adx = fn.getADX(7, resArr.high, resArr.low, resArr.close),
        kstArr = fn.getKST(7, resArr.high, resArr.low, resArr.close),
        structuredData = fn.createStructure(response.data.candles, macdOutput, ema_2_days, ema_5_days, avgTrueRange, arr_adx, kstArr, arr_rsi),
    

    data = data.reverse()[0];
    macd = macd.reverse()[0];
    ema_2_days = ema_2_days.reverse()[0];
    ema_5_days = ema_5_days.reverse()[0];
    adx = adx.reverse()[0];
    rsi = rsi.reverse()[0];

    return {
        'date': data[0],
        'open': data[1],
        'high': data[2],
        'low': data[3],
        'close': data[4],
        'volume': data[5],
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
    'getRSI': getRSI
    //'getAccessToken':getAccessToken
};