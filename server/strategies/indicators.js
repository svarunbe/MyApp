var SMA = require('technicalindicators').SMA;
var roundTo = require('round-to');
var MACD = require('technicalindicators').MACD;
var EMA = require('technicalindicators').EMA;
var ATR = require('technicalindicators').ATR;
var ADX = require('technicalindicators').ADX;
var KST = require('technicalindicators').KST;
var RSI = require('technicalindicators').RSI;
var ForceIndex = require('technicalindicators').ForceIndex;

var indicators = {
    averageTrueRange: function(period, high, low, close) {
        var input = {
            high: high,
            low: low,
            close: close,
            period: period
        }
        return ATR.calculate(input);
    },
    getMACD: function(data, fastPeriod, slowPeriod) {
        var macdInput = {
            values: data,
            fastPeriod: fastPeriod,
            slowPeriod: slowPeriod,
            signalPeriod: 9,
            SimpleMAOscillator: false,
            SimpleMASignal: false
        }
        return MACD.calculate(macdInput);
    },
    getADX: function(period, high, low, close) {
        var input = {
            high: high,
            low: low,
            close: close,
            period: period
        }
        return ADX.calculate(input);
    },
    getRSI: function(period, close) {
        var inputRSI = {
            values: close,
            period: period
        };
        return RSI.calculate(inputRSI)
    },
    getForceIndex: function(period, close, volume) {

        var inputFI = {
            close: close,
            volume: volume,
            period: period
        };
        return ForceIndex.calculate(inputFI)
    },

    getKST: function(period, high, low, close) {
        var input = {
            values: close,
            ROCPer1: 2,
            ROCPer2: 5,
            ROCPer3: 10,
            ROCPer4: 15,
            SMAROCPer1: 2,
            SMAROCPer2: 5,
            SMAROCPer3: 10,
            SMAROCPer4: 15,
            signalPeriod: 9
        };
        return KST.calculate(input)
    },

    getEMA: function(data, period) {
        return EMA.calculate({ period: period, values: data });
    },
    getSuperTrend: function(startFrom, Multiplier, data) {
        for (var p = startFrom; p < data.length; p++) {

            if (data[p]) {
                var avgVal = (data[p].high + data[p].low) / 2,
                v = (Multiplier * data[p].avgTrueRange), g = avgVal - v, x = avgVal + v;

                if (p &&
                    data[p - 1] &&
                    data[p - 1].close &&
                    (data[p - 1].close > data[p - 1]["_uptrend"]) &&
                    (data[p - 1]["_uptrend"] > g)) {
                    x = data[p - 1]["_downtrend"]
                }


                data[p]["direction_supertrend"] = 1;

                    if (p) {
                        data[p]["direction_supertrend"] = data[p - 1]["direction_supertrend"];

                            if (data[p].close > data[p - 1]["_downtrend"]) {
                                data[p]["direction_supertrend"] = 1
                            } else {
                                if (data[p].close > data[p - 1]["_uptrend"]) {
                                    (data[p]["direction_supertrend"] = -1)
                                }
                            }
                    }


                data[p]["_uptrend"] = g,

                    data[p]["_downtrend"] = x,

                    data[p]["trend"] = (data[p]["direction_supertrend"] > 0) ? g : x;


                    if (p) {
                        if (data[p - 1]["direction_supertrend"] > 0) {
                            data[p - 1]["_downtrend"] = null
                        } else {
                            data[p - 1]["_uptrend"] = null
                        }
                        if (data[p]["direction_supertrend"] > 0) {
                            data[p]["_uptrend"] = g
                        } else {
                            data[p]["_downtrend"] = x
                        }

                    }
            }
        }
        return data;
    }
}


module.exports = indicators;