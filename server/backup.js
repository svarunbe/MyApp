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

//ADX Strategy
   /*if(structuredData[i].pdm > structuredData[i].mdm && trendADX!="up"  && structuredData[i].adx > 20){
    console.log("uptrend ADX"+structuredData[i].date)
    trendADX="up";
    profitADX -= structuredData[i].close;
   }else if(trendADX=="up" && ((structuredData[i].adx-4) < structuredData[i-1].adx)) {  // (structuredData[i].pdm < structuredData[i].mdm && trend!="down"){
    console.log("downtrend ADX"+structuredData[i].date)
    trendADX="down";
    profitADX += structuredData[i].close;
   }

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
        profitKST -= structuredData[i].close;
   }else if(structuredData[i].kstSignal!=undefined && structuredData[i].kst < structuredData[i].kstSignal && trendKST=="up"){
        console.log("downtrend KST"+structuredData[i].date+" "+structuredData[i].close)
        trendKST = "down";
        profitKST += structuredData[i].close;
   }

   //macd strategy
   if(structuredData[i].macd > 0 && structuredData[i].macd > structuredData[i].signal && trendmacd!="up") {
        console.log("uptrend macd"+structuredData[i].date+ " "+structuredData[i].close)
        trendmacd = "up";
        profitMacd -= structuredData[i].close;
   }else if(structuredData[i].macd < structuredData[i].signal && trendmacd=="up"){
        console.log("downtrend macd"+structuredData[i].date+" "+structuredData[i].close)
        trendmacd = "down";
        profitMacd += structuredData[i].close;
   }*/

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
let getEMA=function(data,period){
    return EMA.calculate({period : period, values : data});     
}
let getShares = function(job, fn) {

    mongo.connection((db) => {
        db.collection('shares').find().toArray(function(err, result) {
            if (err) throw err;
            _global.shares = result;
            kiteControl.historical(result[0].token, "2017-08-20", "2017-09-18", "15minute")
                .then(function(response) {
                    //console.log(response);
                    var len = response.data.candles.length;
                    var responceWithTR=fn.calculateTrueRange(response.data.candles);
                    //console.log(response.data.candles[len - 1]);
                    fn.generateData(response.data.candles, 4, _global.shares[0].strategy, function(resArr,resObj,strategy) {
                        
                        var trueRangeData=fn.calculateTrueRange(resObj);
                        var atrSuperTrend=fn.calculateATRSuperTrend(trueRangeData);
                        var superTrend=fn.calculateSuperTrend(atrSuperTrend,3);
                        //console.log(superTrend);
                        for (var i = 0; i < superTrend.length; i++) {
                                var d = new Date(superTrend[i].date);
                                var today = new Date("2017-09-18T09:15:00+0530");
                                if (d.getDate() == today.getDate()) {
                                    //console.log(superTrend[i]);
                                    if(i!=0){
                                      if (superTrend[i-1].direction_supertrend > superTrend[i].direction_supertrend) {
                                        console.log("Downtrend " +superTrend[i].date);
                                      } else if (superTrend[i-1].direction_supertrend < superTrend[i].direction_supertrend) {
                                          console.log("uptrend "+ superTrend[i].date);
                                      }else{
                                        //console.log(superTrend[i-1].direction_supertrend,superTrend[i].direction_supertrend)
                                      }  
                                    }
                                }
                            }

                        if (strategy == "no") {
                            var macdOutput = fn.getMACD(resArr.close,5,8);
                            var ema_2_days=fn.getEMA(resArr.close,2);
                            var ema_5_days=fn.getEMA(resArr.close,5);
                            var avgTrueRange=fn.averageTrueRange(7,resArr.high,resArr.low,resArr.close);
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
let calculateTrueRange=function(data){
    for(var i=0;i<data.length;i++){
        if(data[i-1]){
            data[i].trueRange = Math.max(data[i].high - data[i].low, data[i].high - data[i-1].close , data[i-1].close - data[i].low);
        }else{
            data[i].trueRange=data[i].high - data[i].low;
        }
    }
    return data;
}
let calculateATRSuperTrend=function(data,no_days){
    var n={ startFrom:0 };
    var no_days=no_days || 7 ;

    if(data.length < (no_days + 1)){
        console.log("error in atr superTrend");
        return false;
    }else{

    for (var i = 0, u = Math.max(n.startFrom, 1); (u < data.length); u++) {
       var currentData = data[u],
          prev_data = data[u-1],
          trueRange = currentData.trueRange;
        if(data[u-1]["sum_true_range_supertrend"]){
          i = data[u-1]["sum_true_range_supertrend"]
        }
        i += trueRange;

        if(u > no_days){
          i -= data[u-no_days]["true_range_supertrend"];
        }
        data[u]["true_range_supertrend"] = trueRange;
        data[u]["sum_true_range_supertrend"]=i;
        
        if(u===no_days){
          data[u]["atr_superTrend"] = i/no_days;
        }else{
          if(u > no_days){
            data[u]["atr_superTrend"] = ((data[u-1]["atr_superTrend"] * (no_days - 1) + trueRange )/ no_days)    
          }
        } 
    }
    return data;
  }
  
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
            //superTrend(data[i][2],data[i][3],3,atr[i],currentPrice,data[i][4],)
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

let calculateSuperTrend=function(data,Multiplier){
for (var p = 0; p < data.length; p++) {
    //var d = f[p];
    if (data[p]) {
        var m = (data[p].high + data[p].low) / 2
        , v = (Multiplier * data[p].atr_superTrend)
        , g = m - v
        , x = m + v;
                        
        p && 
        (
            data[p-1] 
            && data[p-1].close 
            && (data[p-1].close > data[p-1]["_uptrend"]) 
            && (data[p-1]["_uptrend"] > g) 
            && (g = data[p-1]["_uptrend"]),

            data[p-1] 
            && data[p-1].close 
            && (data[p-1].close < data[p-1]["_downtrend"]) 
            && (data[p - 1]["_downtrend"] < x) 
            && (x = data[p-1]["_downtrend"])
        ),

        data[p]["direction_supertrend"] = 1,
        
        p && 
        (  data[p]["direction_supertrend"] 
            = data[p-1]["direction_supertrend"],
          (data[p].close > data[p - 1]["_downtrend"]) 
          ? data[p]["direction_supertrend"] = 1 
          : (data[p].close > data[p - 1]["_uptrend"]) 
          && (data[p]["direction_supertrend"] = -1)
        ),

        data[p]["_uptrend"] = g,

        data[p]["_downtrend"] = x,

        data[p]["trend"] = (data[p]["direction_supertrend"] > 0) ? g : x,
        
        p && 
        (  
            (data[p - 1]["direction_supertrend"] > 0)  
            ? data[p - 1]["_downtrend"] = null 
            : data[p - 1]["_uptrend"] = null,

           (data[p]["direction_supertrend"] >  0) 
           ? data[p]["_uptrend"] = g 
           : data[p]["_downtrend"] = x
        )
     }
    }
    return data;
}
/*let calculateSuperTrend=function(data,Multiplier){
    for (var i = 0; i < data.length; i++) {
        //var d = data[i]
        if (data[i]) {
            var m = (data[i].high + data[i].low) / 2;
            var v = (Multiplier * data[i].atr_superTrend);
            var g = m - v;
            var x = m + v;

            if(i && data[i-1] && data[i-1].close &&  data[i-1].close > data[i-1]["_uptrend"]  && (data[i-1]["_uptrend"] > g)){     
              g=(data[i-1]["_uptrend"])
            }

            if(data[i-1] && data[i-1].close && data[i-1].close <  data[i-1]["_downtrend"] && (data[i-1]["_downtrend"] < x)){
             x=(data[i-1]["_downtrend"]) 
            }           
            data[i]["direction_supertrend"]=1;

            if(i){
                  (data[i]["direction_supertrend"]= data[i-1]["direction_supertrend"]);
                  
                  if(data[i].close > data[i-1]["Downtrend"]){
                    (data[i]["direction_supertrend"]=1)
                  }else{
                    if(data[i].close < data[i-1]["uptrend"]){
                      data[i]["direction_supertrend"]=-1;
                    }
                  } 
            }
            data[i]["_uptrend"]=g;
            data[i]["_downtrend"]=x;

            data[i]["trend"]= data[i]["direction_supertrend"] > 0 ? g : x;

                if(i){
                    if(data[i - 1]["direction_supertrend"] > 0){
                      data[i-1]["_downtrend"] = null 
                    }else{
                      data[i- 1]["_uptrend"] = null
                    }

                    if(data[i]["direction_supertrend"] > 0){
                      data[i]["uptrend"] = g 
                    }else{
                      data[i]["downtrend"] = x
                    }                     
                 }
        }
    }
    return data;
}*/
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
    'calculateSuperTrend':calculateSuperTrend,
    'calculateTrueRange':calculateTrueRange,
    'calculateATRSuperTrend':calculateATRSuperTrend
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


/*let superTrend=function(HIGH,LOW,Multiplier,ATR,currentPrice,Current_Close,Previous_Close,Previous_UPPERBAND,Previous_LOWERBAND){
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
 }
*/
