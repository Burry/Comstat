var bodyParser = require('body-parser');
var spawn = require('child_process').spawn;
var express = require('express');
var http = require('http');
var path = require('path');
var router = express.Router();
var db = require('./db');

var socketPort = 3233;
var server = http.createServer();
var io = require('socket.io')(server);
server.listen(socketPort);

db.getComcastAccount(function(account) {
    if (account) {
        console.log("Logged into Comcast as " + account.username);
    } else {
        console.log("Welcome! Please load Comstat in a browser to get started.");
    }
});

function isLocal(req) {
    var host = req.headers.host;
    if (host.includes('localhost') ||
        host.includes('127.0.0.1') ||
        host.includes('0.0.0.0') ||
        host.includes('::ffff:127.0.0.1') ||
        host.includes('::1'))
    { return true; }
    else { return false; }
}

/* GET home page */
router.get('/', function(req, res, next) {
    var hostname = 'localhost' //TEMP - Add to DB
    db.getComcastAccount(function(account) {
        if (account) {
            res.render('index', {
                title: 'Comstat',
                dataCap: account.dataCap,
                socketHost: isLocal(req) ? '//127.0.0.1:' + socketPort : '//' + hostname + ':' + socketPort
            });
        } else {
            res.render('setup', {
                title: 'Comstat » Setup'
            });
        }
    });
});

/* GET socket.io/socket.io.js */
router.get('/socket.io/socket.io.js', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../public/javascripts/socket.min.js'));
});

/* POST /config */
router.post('/config', function(req, res, next) {
    var username = req.body.username,
    password = req.body.password,
    dataCap = req.body.dataCap ? req.body.dataCap : 1024,
    accountInfo = {
        _id: 1,
        username: username,
        password: password,
        dataCap: dataCap
    };
	db.setComcastAccount(accountInfo, function() {
        res.redirect('/');
    });
});

/* GET python query to check Comcast credentials */
router.post('/comcast/check', function(req, res, next) {
    var valid,
    pyScriptPath = path.resolve(__dirname, './comcast/comcast.py'),
    args = [pyScriptPath, req.body.username, req.body.password],
    pyScript = spawn('python3', args);
    pyScript.stdout.on('data', function(data) {
        data = data.toString('utf8');
        if (data.charAt(0) == "{") {
            if (JSON.parse(data).used != null) res.send('ok');
            else res.send('fail');
        }
    });
});

/* GET python query to fetch Comcast data */
router.get('/comcast/data', function(req, res, next) {
    db.getComcastAccount(function(account) {
        if (account) {
            var result,
            pyScriptPath = path.resolve(__dirname, './comcast/comcast.py'),
            args = [pyScriptPath, account.username, account.password],
            pyScript = spawn('python3', args);
            pyScript.stdout.on('data', function(data) {
                data = data.toString('utf8');
                if (data.charAt(0) != "{") {
                    io.emit('updateLoadingStatus', data);
                } else result = data;
            });
            pyScript.on('close', function() {
                res.send(result);
            });
        } else res.redirect('/');
    });
});


module.exports = router;
