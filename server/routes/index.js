var express = require('express');
var router = express.Router();
var init = require('../strategies/init.js');
let mongo = require('../modules/mongoConnection.js');
let auth = require('../modules/auth.js');

router.post('/shares', function(req, res) {
	mongo.connection((db) => {
        db.collection('shares').find({}).toArray(function(err, result) {
            if (err) {
            	res.json("error");
            }else{
            	res.json(result[0]);	
            }            
            db.close();
        });
    });
});
router.post('/signup/:username/:password', function(req, res) {

    if (!req.params.username) {
        return res.send(400).send("username required");;
    }
    if (!req.params.password) {
        return res.send(400).send("password required");
    }

    auth.signUp(req.params.username, req.params.password)
        .then(function(responseText) {
            res.send(200);
        }, function(error) {
            console.error(error);
            res.send(400).json("signup Failed");
        }, function(progress) {
            // Log the progress as it comes in. 
            console.log("Request progress: " + Math.round(progress * 100) + "%");
        });
});
router.post('/authenticate', function(req, res) {
	/*console.log(req.body);
    if (!req.body.username) {
        res.send(400).json("username required");
        res.end();
        return ;
    }
    if (!req.body.password) {
        return res.send(400).json("password required");
        res.end();
        return ;
    }*/
   
    auth.localAuth("test", "test")
        .then(function(responseText) {
            res.json(responseText);
        }, function(error) {
            console.error(error);
            res.send(400).json("Login Failed");
        }, function(progress) {
            // Log the progress as it comes in. 
            console.log("Request progress: " + Math.round(progress * 100) + "%");
        });
});


router.get('/kitelogin/:access_token', function(req, res) {
    init.kiteLogin(req.params.access_token, res, function(err, message) {
        if (!err) {
            res.send(message);
        } else {
            res.send(err);
        }
    });
});
router.post('/add/:task', function(req, res) {
    var obj = {
        token: _global.shares[req.params.task],
        timeline: "5minute",
        taskName: req.params.task,
        start: false
    }
    init.addTask(obj, req, res, function(err) {
        res.send('im the add page!');
    });
});
// about page route (http://localhost:8080/about)
router.post('/run/:task', function(req, res) {
    init.run(req.params.task, req, res, function(err) {
        res.send('im the run page!');
    });
});

router.get('/stop/:task', function(req, res) {
    init.stop(req.params.task, req, res, function(err) {
        res.send('im the stop page!');
    });
});

router.get('/remove/:task', function(req, res) {
    init.remove(req.params.task, req, res, function(err) {
        res.send('im the remove page!');
    });
});

module.exports = router;