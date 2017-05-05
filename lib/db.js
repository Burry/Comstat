var sqlite3 = require('sqlite3').verbose();
var db;
var dbName = './db.sqlite3';
var account = {
    username: null,
    password: null,
    dataCap: null
};
var config = {
	hostname: 1024,
	urlBase: '/',
	port: 3234,
	interface: 'localhost'	
};

// Config functions
var getAppConfig = function getAppConfig(cb) {
    db = new sqlite3.Database(dbName, function() {
        db.all("SELECT rowid, info FROM config", function(err, rows) {
            if (rows) {
                config.hostname = rows[0].info;
                config.urlBase = rows[1].info;
                config.port = rows[2].info;
				config.port = rows[3].info;
            }
            db.close(function() {
                cb();
            });
        });
    });
};

var setAppConfig = function setAppConfig(hostname, urlBase, port, interface, cb) {
    var createQuery = "CREATE TABLE IF NOT EXISTS config (info TEXT)";
    var deleteQuery = "DELETE FROM config";

    db = new sqlite3.Database(dbName, function() {
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='config'", function(err, row) {
            if (row === undefined) {
                db.run(createQuery, function() {
                    fillRows(hostname, urlBase, port, interface, cb);
                });
            } else {
                db.run(deleteQuery, function() {
                    fillRows(hostname, urlBase, port, interface, cb);
                });
            }
        });
    });

    function fillRows(hostname, urlBase, port, interface, cb) {
        var stmt = db.prepare("INSERT INTO config VALUES (?)");
        stmt.run(hostname);
        stmt.run(urlBase);
        stmt.run(port);
        stmt.run(interface);
        stmt.finalize(function() {
            db.close(function () {
                cb();
            });
        });
    }
};


// Comcast account functions
var getComcastAccount = function getComcastAccount(cb) {
    db = new sqlite3.Database(dbName, function() {
        db.all("SELECT rowid, info FROM comcastAccount", function(err, rows) {
            if (rows) {
                account.username = rows[0].info;
                account.password = rows[1].info;
                account.dataCap = rows[2].info;
            }
            db.close(function() {
                cb();
            });
        });
    });
};

var setComcastAccount = function setComcastAccount(username, password, dataCap, cb) {
    var createQuery = "CREATE TABLE IF NOT EXISTS comcastAccount (info TEXT)";
    var deleteQuery = "DELETE FROM comcastAccount";

    db = new sqlite3.Database(dbName, function() {
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='comcastAccount'", function(err, row) {
            if (row === undefined) {
                db.run(createQuery, function() {
                    fillRows(username, password, dataCap, cb);
                });
            } else {
                db.run(deleteQuery, function() {
                    fillRows(username, password, dataCap, cb);
                });
            }
        });
    });

    function fillRows(username, password, dataCap, cb) {
        if (!dataCap) dataCap = 1024;
        var stmt = db.prepare("INSERT INTO comcastAccount VALUES (?)");
        stmt.run(username);
        stmt.run(password);
        stmt.run(dataCap);
        stmt.finalize(function() {
            db.close(function () {
                cb();
            });
        });
    }
};

module.exports = {
		config: config,
        account: account,
        getComcastAccount: getComcastAccount,
        setComcastAccount: setComcastAccount,
        getAppConfig: getAppConfig,
        setAppConfig: setAppConfig
};
