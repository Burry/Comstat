var bodyParser = require('body-parser');
var spawn = require('child_process').spawn;
var express = require('express');
var server = require('http').Server(express);
var io = require('socket.io')(server, {origin:'*:*'});
var path = require('path');
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
    var hostname = ( req.headers.host.match(/:/g) ) ? req.headers.host.slice( 0, req.headers.host.indexOf(":") ) : req.headers.host;
    if (setup) {
        res.render('index', {
            title: 'Comstat',
            host: req.protocol + '://' + hostname
        });
    } else {
        res.render('setup', {
            title: 'Comstat » Setup',
            secure: secure
        });
    }
});

/* POST /config */
router.post('/config', function(req, res, next) {
    var username = req.body.username,
    password = req.body.password,
    dataCap = req.body.dataCap;
    db.setComcastAccount(username, password, dataCap, function() {
        db.getComcastAccount(function() {
            setup = true;
            res.redirect('/');
        });
    });
});

/* GET python query to Comcast */
router.get('/response', function(req, res, next) {
    if (setup) {
        var query;
        var pyScriptPath = path.resolve(__dirname, './comcast/comcast.py');
        var args = [pyScriptPath, db.account.username, db.account.password];
        var pyScript = spawn('python3', args);
        pyScript.stdout.on('data', function(data) {
            data = data.toString('utf8');
            if (data.charAt(0) != "{") {
                console.log(data);
                updateLoadingStatus(data);
            } else query = data;
        });
        pyScript.on('close', function() {
            res.send(query);
        });
    } else res.redirect('/');
});

/* Live-updating Comcast query via Socket.io */
function updateLoadingStatus(data) {
    io.sockets.on('connection', function(socket) {
        socket.emit('updateLoadingStatus', { status: data });
    });
}


module.exports = router;
