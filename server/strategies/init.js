var express = require('express');
var CronJob = require('cron').CronJob;
var roundTo = require('round-to');
var mongo = require('../modules/mongoConnection.js');
var list = require('./strategyCronJob.js');
var indicators = require('./indicators.js');
var generalFn = require('./common.js');
var crons = require('../routes/crons');
var _ = require('underscore');

let getAccessToken = function() {
    mongo.connection((db) => {
        db.collection('users').find({ "name": "vijay" }).toArray(function(err, result) {
            if (err) throw err;
            //console.log(result);
            //return result;
            list.checkKiteAccessToken(result[0].accessToken);
            //db.close();
        });
    });
}
let kiteLogin = function(session_token,res,callback) {
    kiteControl.requestAccessToken(session_token, "1ogeryewziiava62tj3iwkscjzv4ke10")
        .then(function(response) {
            init(response.data.access_token, response.data.user_id, response.data.public_token);
            callback(null,response);
        })
        .catch(function(err) {
            callback(err.response);
            //crons.init();
        })

    function init(access_token, user_id, public_token) {
        console.log("kite Login Successful");
        _global.access_token = access_token;
        _global.user_id = user_id;
        _global.public_token = public_token;
        kiteControl.setAccessToken(access_token);
        crons.init();
    }
}

let runCronJob = function(stockToken, period, strategy, frequency, req, res, callback) {
    callback(res);
    //fn.getShares(job, fn);
}
let addTask = function(task, req, res, callback) {
    _cronRecord.push(task);
    callback(null);
}
let run = function(task, req, res, callback) {
    var index = _.findLastIndex(_cronRecord, {
        taskName: task
    });
    _cronRecord[index].start = true;
    callback(null);
}
let stop = function(task, req, res, callback) {
    var index = _.findLastIndex(_cronRecord, {
        taskName: task
    });
    _cronRecord[index].start = false;
    callback(null);
}
let remove = function(task, req, res, callback) {
    var index = _.findLastIndex(_cronRecord, {
        taskName: task
    });
    _cronRecord.splice(index, 1);

    callback(null);
}
module.exports = {
    'runCronJob': runCronJob,
    'getAccessToken': getAccessToken,
    'kiteLogin': kiteLogin,
    'addTask': addTask,
    'run': run,
    'stop': stop,
    'remove': remove
};