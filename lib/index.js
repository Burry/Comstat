var bodyParser = require('body-parser');
var spawn = require('child_process').spawn;
var express = require('express');
var http = require('http');
var path = require('path');
var port = 3233;
var router = express.Router();
var db = require('./db');
var setup;

var server = http.createServer();
var io = require('socket.io')(server);
server.listen(port);


// db.config.port
// db.config.urlBase
// db.config.hostname
// db.config.interface


db.getAppConfig(function() {
	console.log(db.config.port);
	db.getComcastAccount(function() {
	    if (db.account.username !== null) {
	        console.log("Logged into Comcast as " + db.account.username);
	        setup = true;
	    } else {
	        console.log("Welcome! Please load Comstat in a browser to get started.");
	        setup = false;
	    }
	});
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

/* GET home page. */
router.get('/', function(req, res, next) {
    var host = isLocal(req) ? '127.0.0.1 + ':' + db.config.port + db.config.urlBase : db.config.hostname + ':' + db.config.port + db.config.urlBase;
    if (setup) {
        res.render('index', {
            title: 'Comstat',
            host: '//' + host + db.config.urlBase
        });
    } else {
        res.render('setup', {
            title: 'Comstat » Setup'
        });
    }
});

/* POST /config */
router.post('/config', function(req, res, next) {
    var username = req.body.username,
    password = req.body.password,
    dataCap = req.body.dataCap,
    hostname = req.body.hostname,
    urlBase = req.body.urlBase,
    port = req.body.port,
    interface = req.body.port,
    db.setAppConfig(username, password, dataCap, hostname, urlBase, port, interface, function() {
    	db.setComcastAccount(username, password, dataCap, function() {
	        db.getAppConfig(function() {
	            setup = true;
	            res.redirect('/');
	        });
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
    io.emit('updateLoadingStatus', data);
}


module.exports = router;
