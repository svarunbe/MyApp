var express = require('express');
var router = express.Router();
var init = require('../strategies/init.js');
// home page route (http://localhost:8080)
router.get('/', function(req, res) {
	res.send('im the home page!');  	
});
router.get('/kitelogin/:access_token',function(req,res) {
	init.kiteLogin(req.params.access_token,res,function(err,message){
		if(!err){
			res.send(message);  		
		}else{
			res.send(err);  		
		}
	});
});
router.get('/add/:task', function(req, res) {
    var obj={
		token:_global.shares[req.params.task],
		timeline:"5minute",
		taskName:req.params.task,
		start:false
	}
	init.addTask(obj,req,res,function(err){
		res.send('im the add page!');  	
	});
});
// about page route (http://localhost:8080/about)
router.get('/run/:task', function(req, res) {
    init.run(req.params.task,req,res,function(err){
		res.send('im the run page!');  	
	});
});

router.get('/stop/:task', function(req, res) {
    init.stop(req.params.task,req,res,function(err){
		res.send('im the stop page!');  	
	});
});

router.get('/remove/:task', function(req, res) {
    init.remove(req.params.task,req,res,function(err){
		res.send('im the remove page!');  	
	});
});

module.exports = router;
