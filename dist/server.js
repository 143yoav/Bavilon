'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _tweetsRoutes = require('./api/routes/tweetsRoutes');

var _tweetsRoutes2 = _interopRequireDefault(_tweetsRoutes);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _db = require('./config/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = process.env.PORT || 3000;
var app = (0, _express2.default)();
var dbClient = _mongodb2.default.MongoClient;

app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());

var connectionString = process.env.connection_string;

dbClient.connect(_db2.default.url, async function (err, database) {
  if (err) {
    console.log(err);
  } else {
    var isValid = await validateDataBase(database.db('tweets_db'));
    if (isValid) {
      (0, _tweetsRoutes2.default)(app, database.db('tweets_db'));
      app.listen(port);
      console.log('We are live on port ', port);
    } else {
      console.log('DB is not valid');
    }
  }
});

var validateDataBase = async function validateDataBase(db) {
  var result = false;
  var cols = await db.listCollections().toArray();

  cols.forEach(function (element) {
    if (element.name == 'tweets') {
      result = true;
    }
  });

  return result;
};