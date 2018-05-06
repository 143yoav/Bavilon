'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _tweetsRoutes = require('./api/routes/tweetsRoutes');

var _tweetsRoutes2 = _interopRequireDefault(_tweetsRoutes);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _db = require('./config/db');

var _db2 = _interopRequireDefault(_db);

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = process.env.PORT || 3000;
var app = (0, _express2.default)();

app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/postgres';
var client = new _pg2.default.Client(connectionString);
client.connect().then(async function (val) {
  await (0, _db2.default)(client);

  (0, _tweetsRoutes2.default)(app, client);
  app.listen(port, function () {
    return console.log('Live on : ', port);
  });
}, function (reason) {
  console.log(reason);
});