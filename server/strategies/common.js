var express = require('express');
var CronJob = require('cron').CronJob;
var roundTo = require('round-to');
let mongo = require('../modules/mongoConnection.js');

var common = {
    get5minuteHistorical: function(stockToken, lastDate, todayDate, fn, callback) {
        kiteControl.historical(stockToken, lastDate, todayDate, "5minute")
            .then(function(response) {
                fn.generateData(response.data.candles, 4, _global.shares[0].strategy, function(resArr, resObj, strategy) {
                    var ob = {
                        obj: resObj,
                        arr: resArr
                    }
                    callback(null, ob);
                });
            })
            .catch(function(err) {
                console.log("err getting historical data 5 min" + err);
                callback(err, "error");
            });
    },
    get15minuteHistorical: function(stockToken, lastDate, todayDate,timeline, callback1) {

        kiteControl.historical(stockToken, lastDate, todayDate,timeline)
            .then(function(response) {
                callback1(null, response);
            })
            .catch(function(err) {
                console.log("err getting historical data 15 min" + err);
                callback1(err, "error");
            });
    },
    createStructure: function(candels15Min, fifteenMinData, fn, callback4) {
        var macdFifteenMin = fn.getMACD(fifteenMinData.close, 13, 26),
            ema_2_daysFifteenMin = fn.getEMA(fifteenMinData.close, 2),
            ema_5_daysFifteenMin = fn.getEMA(fifteenMinData.close, 5),
            avgTrueRange = fn.averageTrueRange(7, fifteenMinData.high, fifteenMinData.low, fifteenMinData.close),
            adxFifteenMin = fn.getADX(5, fifteenMinData.high, fifteenMinData.low, fifteenMinData.close),
            kstFifteenMin = fn.getKST(9, fifteenMinData.high, fifteenMinData.low, fifteenMinData.close),
            sma_5_days = fn.getSMA(fifteenMinData.close, 5),
            macdFifteenMin = macdFifteenMin.reverse(),
            sma_5_days = sma_5_days.reverse(),
            ema_2_daysFifteenMin = ema_2_daysFifteenMin.reverse(),
            ema_5_daysFifteenMin = ema_5_daysFifteenMin.reverse(),
            adxFifteenMin = adxFifteenMin.reverse(),
            kstFifteenMin = kstFifteenMin.reverse(),
            avgTrueRange = avgTrueRange.reverse(),
            candels15Min = candels15Min.reverse();

        var newData = [];
        var ohlc = 0;
        for (var i = 0; i < candels15Min.length; i++) {

            if (macdFifteenMin[i] && ema_2_daysFifteenMin[i] &&
                ema_5_daysFifteenMin[i] &&
                adxFifteenMin[i] && kstFifteenMin[i] && avgTrueRange) {
                ohlc = candels15Min[i].open + candels15Min[i].high + candels15Min[i].low + candels15Min[i].close
                ohlc = ohlc / 4;
                newData.push({
                    'date': candels15Min[i].date,
                    'open': candels15Min[i].open,
                    'high': candels15Min[i].high,
                    'low': candels15Min[i].low,
                    'close': candels15Min[i].close,
                    'volume': candels15Min[i].volume,
                    'macdFifteenMin': macdFifteenMin[i].MACD,
                    'signalFifteenMin': macdFifteenMin[i].signal,
                    'ema_2_daysFifteenMin': ema_2_daysFifteenMin[i],
                    'ema_5_daysFifteenMin': ema_5_daysFifteenMin[i],
                    'sma_5_days':sma_5_days[i],
                    'adxFifteenMin': adxFifteenMin[i].adx,
                    'pdmFifteenMin': adxFifteenMin[i].pdi,
                    'mdmFifteenMin': adxFifteenMin[i].mdi,
                    'kstFifteenMin': kstFifteenMin[i].kst,
                    'kstSignalFifteenMin': kstFifteenMin[i].signal,
                    'avgTrueRange': avgTrueRange[i],
                    'ohlc': ohlc
                });

            } else {
                i = candels15Min.length;
            }
        }

        newData = newData.reverse();
        //newData = fn.getSuperTrend(0, 3, newData);
        callback4(null, newData);
    },
    generateData: function(resData, closing, callback2, callback3) {
        var resultArrayPattern = {
            'high': [],
            'low': [],
            'close': [],
            'volume': []
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
        callback2(resultArrayPattern, resultObjectPattern, resData, callback3);
    },
    runStrategy: function(token, structuredData) {
        var profitMacd = 0,
            trendmacd = "";

        var p ={
            price : 0,
            success:0,
            failed:0,
        }
        for (var i = 0; i < structuredData.length; i++) {

            var d = new Date(structuredData[i].date);
            var today = new Date();
            if (true) {
                
                    if (trendmacd != "up" && structuredData[i-1] && 
                        structuredData[i].kstFifteenMin > structuredData[i].kstSignalFifteenMin &&
                        structuredData[i].ema_2_daysFifteenMin > structuredData[i].sma_5_days &&
                        structuredData[i].sma_5_days > structuredData[i-1].sma_5_days  &&
                        structuredData[i].macdFifteenMin > structuredData[i].signalFifteenMin) {
                        console.log("buy " + structuredData[i].date + " " + structuredData[i].ohlc);
                        trendmacd = "up";
                        p.price=structuredData[i].ohlc;
                        profitMacd -= structuredData[i].ohlc;
                    } else if (trendmacd == "up" 
                        &&  structuredData[i].ema_2_daysFifteenMin < structuredData[i].sma_5_days) {
                        trendmacd = "down";
                        profitMacd += structuredData[i].ohlc;
                        if(p.price > structuredData[i].ohlc){
                            p.failed++;
                            console.log("sell " + structuredData[i].date + " " + structuredData[i].ohlc);
                        }else{
                            p.success++;
                        }
                    }
                
            }
        }
        console.log(profitMacd + "  " + token +" successful "+p.success+ " failed "+p.failed);


    },
    placeOrder: function(tradingsymbol, exchange, transaction_type, quantity, order_type, product) {
        kiteControl.orderPlace({
                tradingsymbol: "SBIN",
                exchange: "NSE",
                transaction_type: "BUY",
                quantity: 1,
                order_type: "MARKET",
                product: "CNC"
            })
            .then(function(response) {
                console.log(response);
                // You got user's margin details.
            })
            .catch(function(err) {
                console.log(err);
            })
    }
}

module.exports = common;