var sqlite3 = require('sqlite3').verbose();
var db;
var dbName = './db.sqlite3';
var account = {
    username: null,
    password: null,
    dataCap: null
};

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
        account: account,
        getComcastAccount: getComcastAccount,
        setComcastAccount: setComcastAccount,
};
