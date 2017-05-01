var childProcess = require('child_process').spawn;
var express = require('express');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var router = express.Router();
var db;

fs.open('./db.sqllite', 'r', function(err, fd) {
    if (!err) {
        console.log('found a db!');
    } else if (err && err.code=='ENOENT') {
        db = new sqlite3.Database('./db.sqllite');
        db.serialize(function() {
          db.run("CREATE TABLE loginDetails (info TEXT)");

          var stmt = db.prepare("INSERT INTO loginDetails VALUES (?)");
          stmt.run("USERNAME " + 0);
          stmt.run("PASSWORD " + 1);
          stmt.finalize();

          db.each("SELECT rowid AS id, info FROM loginDetails", function(err, row) {
              console.log(row.id + ": " + row.info);
          });
        });
        db.close();
    }
});


function dbExists() {
  fs.open('./db.sqllite', 'r', function(err, fd) {
    if (err && err.code=='ENOENT') { return false }
    else { return true }
  });
}


/* GET home page. */
router.get('/', function(req, res, next) {
    if (dbExists()) {
        var title = req.app.get('customTitle');
        var icon = req.app.get('customIcon');
        res.render('index', {
            title: title,
            icon: icon
        });
    } else {
        res.render('setup', {});
    }
});

/* GET python query to Comcast */
router.get('/response', function(req, res, next) {
    var username = req.app.get('username');
    var password = req.app.get('password');
    var comcastPy = childProcess('python3',[
        'comcast/comcast.py',
        username,
        password
    ]);
    comcastPy.stdout.pipe(res);
});


module.exports = router;
