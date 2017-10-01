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
    }
}


module.exports = indicators;