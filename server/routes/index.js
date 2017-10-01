var express = require('express');
var router = express.Router();
var init = require('../strategies/init.js');
// home page route (http://localhost:8080)
router.get('/', function(req, res) {
	res.send('im the home page!');  	
});
router.get('/add/:task/:token', function(req, res) {
    var obj={
		token:req.params.token,
		timeline:"15minute",
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
