var returnRouter = function(db, io) {
    var bodyParser = require('body-parser');
    var express = require('express');
    var path = require('path');
    var router = express.Router();
    var spawn = require('child_process').spawn;

    function callScraper(account, streamStatusCb, streamResultCb, closeCb) {
        var data,
        pyScriptPath = path.resolve(__dirname, './comcast/comcast.py'),
        args = [pyScriptPath, account.username, account.password],
        pyScript = spawn('python3', args);
        pyScript.stdout.on('data', function(stdout) {
            data = stdout.toString('utf8').replace(/\n/g, '');
            if (!isNaN(data)) {
                if (streamResultCb) streamResultCb(data);
            } else if (streamStatusCb) streamStatusCb(data);
        });
        pyScript.on('close', function() {
            if (closeCb) closeCb(data);
        })
    }

    (function(){
        db.getComcastAccount(function(account) {
            if (account) {
                io.emit('notifyComcastQuery');
                callScraper(account, function(data) {
                    io.emit('updateComcastQueryStatus', data);
                },
                function(data) {
                    db.setUseData(data, function() {
                        db.getLastUseData(function(dataObject) {
                            io.emit('updateComcastQuery', dataObject);
                        });
                    });
                });
            }
        });
        setTimeout(arguments.callee, 3600000);
    })();

    /* GET home page */
    router.get('/', function(req, res, next) {
        var comcastAccount;
        db.getComcastAccount(function(account) {
            if (account) {
                db.getDailyUseData(function(dataArray) {
                    if (!dataArray) {
                        io.emit('notifyComcastQuery');
                        callScraper(account,
                            function(data) {
                                io.emit('updateComcastQueryStatus', data);
                            }, function(data) {
                                db.setUseData(data, function() {
                                    db.getDailyUseData(function(dataArray) {
                                        console.log(dataArray)
                                        cb(account, dataArray)
                                    });
                                });
                        });
                    } else cb(account, dataArray);
                });
            } else {
                res.render('setup', {
                    title: 'Comstat » Setup'
                });
            }
        });
        function cb(account, dataArray) {
            lastUsageData = dataArray[dataArray.length - 1];
            io.emit('updateComcastQuery', lastUsageData);
            res.render('index', {
                title: 'Comstat',
                currentUsage: lastUsageData,
                dailyUsageData: JSON.stringify(dataArray),
                dataCap: account.dataCap,
                main: true
            });
        }
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
        account = {username: req.body.username, password: req.body.password}
        callScraper(account, null, function(data) {
            if (data != null) {
                db.setUseData(data, function() {
                    return res.send('ok');
                });
            } else return res.send('fail');
        });
    });

    /* Socket emmit from client to trigger Comcast data fetching */
    io.on('connection', function(socket) {
        socket.on('requestComcastQuery', function(name, cb) {
            db.getComcastAccount(function(account) {
                if (account) {
                    io.emit('notifyComcastQuery');
                    callScraper(account,
                        function(data) {
                            io.emit('updateComcastQueryStatus', data);
                        }, function(data) {
                            db.setUseData(data, function() {
                                db.getLastUseData(function(dataObject) {
                                    io.emit('updateComcastQuery', dataObject);
                                    cb(dataObject);
                                });
                            });
                        }
                    );
                } else return  res.redirect('/');
            });
        });
    });

    return router;
}

module.exports = returnRouter;
