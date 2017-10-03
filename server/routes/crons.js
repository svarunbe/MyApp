var CronJob = require('cron').CronJob;
var async = require('async');
var common = require('../strategies/common.js');
var indicators = require('../strategies/indicators.js');

var cron = {
    init: function(argument) {
        var $this = this;
        var job = new CronJob({
            cronTime: '*/20 * * * * *',
            onTick: function() {
                console.log("*");
                if (_cronRecord.length) {
                    async.each(_cronRecord, function(task, callback) {
                        // Perform operation on file here.
                        if (!task.start) {
                            callback("do not process " + task.taskName);
                        } else {
                            // Do work to process file here
                            $this.startJob(task);
                            console.log('task processed' + task.taskName);
                            callback();
                        }
                    }, function(err) {
                        if (err) {
                            console.log('A task failed to process');
                        } else {
                            //console.log('All files have been processed successfully');
                        }
                    });
                }
            },
            start: true,
            timeZone: 'America/Los_Angeles'
        });
        job.start();
        //common.placeOrder();
    },
    getRequireParams: function() {
        var date = new Date();
        var todayDate = date.getFullYear() + '-' +
            ((date.getMonth() + 1).toString().length == 1 ? '0' +
                (date.getMonth() + 1) : (date.getMonth() + 1)) +
            '-' + (date.getDate().toString().length == 1 ? ('0' + date.getDate()) : date.getDate());
        var prevDate = new Date(date.setDate(date.getDate() - 29));
        prevDate = prevDate.getFullYear() + '-' +
            ((prevDate.getMonth() + 1).toString().length == 1 ? '0' +
                (prevDate.getMonth() + 1) : (prevDate.getMonth() + 1)) +
            '-' + (prevDate.getDate().toString().length == 1 ? ('0' + prevDate.getDate()) : prevDate.getDate());

        return {
            today: todayDate,
            prevDate: prevDate
        };
    },
    startJob: function(task) {
        var params = this.getRequireParams();
        async.autoInject({
            get_data: function(callback1) {
                common.get15minuteHistorical(task.token, params.prevDate, params.today,task.timeline, callback1);
            },
            generate_data: function(get_data,callback3) {
                common.generateData(get_data.data.candles,4, function(resArr,resObj,candels,callback2) {
                    callback3(null, {
                        obj: resObj,
                        arr: resArr,
                        candels:candels
                    });
                },callback3);
            },
            createStructure:function(generate_data,callback4){
            	common.createStructure(generate_data.obj, generate_data.arr,indicators,callback4)
            }
        }, function(err, results) {
        	if(err){
        		console.log('err = ', err);	
        	}else{
        		common.runStrategy(task.token,results.createStructure);
        	}
        });
    }
}

module.exports = cron;