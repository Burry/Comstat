var bodyParser = require('body-parser');
var childProcess = require('child_process').spawn;
var express = require('express');
var router = express.Router();
var db = require('./db');
var setup;

db.getComcastAccount(function() {
    if (db.account.username !== null) {
        console.log("Logged into Comcast as " + db.account.username);
        setup = true;
    } else {
        console.log("Welcome! Please load Comstat in a browser to get started.");
        setup = false;
    }
});

function checkSecure(req) {
    var host = req.headers.host;
    if (req.secure ||
        host.includes('localhost') ||
        host.includes('127.0.0.1') ||
        host.includes('0.0.0.0') ||
        host.includes('::ffff:127.0.0.1') ||
        host.includes('::1'))
    { return true; }
    else { return false; }
}

/* GET home page. */
router.get('/', function(req, res, next) {
    var secure = checkSecure(req);
    console.log("Is the database setup? " + setup);
    if (setup) {
        res.render('index', {
            title: 'Comstat'
        });
    } else {
        res.render('setup', {
            title: 'Comstat » Setup',
            secure: secure
        });
    }
});

/* GET python query to Comcast */
router.get('/response', function(req, res, next) {
    if (db.setup) {
        var comcastPy = childProcess('python3',[
            'comcast/comcast.py',
            db.account.username,
            db.account.password
        ]);
        comcastPy.stdout.pipe(res);
    } else res.redirect('/');
});

/* POST /config */
router.post('/config', function(req, res, next) {
    var username = req.body.username,
    password = req.body.password,
    dataCap = req.body.dataCap;
    db.setComcastAccount(username, password, dataCap, function() {
        db.getComcastAccount(function() {
            console.log(db.account.username);
            res.redirect('/');
        });
    });
});

module.exports = router;
