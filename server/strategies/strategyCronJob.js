var express = require('express');
var CronJob = require('cron').CronJob;
var socketPort = require('../modules/socketConnection.js');
let mongo = require('../modules/mongoConnection.js');
var async = require('async');



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
    'checkKiteAccessToken': checkKiteAccessToken,
    
};