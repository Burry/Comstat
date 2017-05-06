var db;
var engine = require("tingodb")({});
var fs = require('fs');
var cfg = {
	"app":{
		"engine":"tingodb"
	},
	"mongo":{
		"host":"127.0.0.1",
		"port":27017,
		"db":"db",
		"opts":{
			"auto_reconnect": true,
			"safe": true
		}
	},
	"tingo":{
		"path":"./db"
	}
}

module.exports.getDB = function() {
	if (!db) db = new engine.Db(cfg.tingo.path, {});
	return db;
}

module.exports.ObjectID = engine.ObjectID;
