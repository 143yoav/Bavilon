'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.listAllTweets = listAllTweets;
exports.postTweet = postTweet;
exports.likeTweet = likeTweet;
exports.retweet = retweet;
exports.listAllReTweets = listAllReTweets;
var DB = null;

function init(db) {
  DB = db;
}

async function listAllTweets(req, res) {
  var result = await DB.query('SELECT * FROM public.tweets');
  var rows = [];
  result.rows.forEach(function (x) {
    rows.push(x);
  });
  var data = await arrangeTweets(rows);
  res.send(data);
}

function postTweet(req, res) {
  DB.query('INSERT INTO public.tweets(username, content, "timestamp") VALUES(\'' + req.body.username + '\',\'' + req.body.content + '\',\'' + isoTimeStamp() + '\')').then(function (result) {
    res.end('success');
  }, function (reason) {
    console.log(reason);
  });
}

function likeTweet(req, res) {
  DB.query('INSERT INTO public.likes(postid, username, "timestamp") VALUES(' + parseInt(req.params.id) + ',\'' + req.body.username + '\',\'' + isoTimeStamp() + '\')').then(function (result) {
    res.end('success');
  }, function (reason) {
    console.log(reason);
  });
}

function retweet(req, res) {
  var details = { id: parseInt(req.params.id) };
  DB.query('INSERT INTO public.retweets(postid, username, "timestamp") VALUES(' + parseInt(req.params.id) + ',\'' + req.body.username + '\',\'' + isoTimeStamp() + '\')').then(function (result) {
    res.end('success');
  }, function (reason) {
    console.log(reason);
  });
}

async function listAllReTweets(req, res) {
  var result = await DB.query('SELECT * FROM public.retweets');
  var rows = [];
  result.rows.forEach(function (x) {
    rows.push(x);
  });
  var data = await arrangeReTweets(rows);
  res.send(data);
}

var isoTimeStamp = function isoTimeStamp() {
  return new Date(Date.now()).toISOString();
};

var arrangeTweets = async function arrangeTweets(items) {
  var arrangedData = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      var likes = await countRows('likes', item.id);
      var retweets = await countRows('retweets', item.id);

      arrangedData.push({
        id: item.id,
        username: item.username,
        timestamp: item.timestamp,
        content: item.content,
        likes_count: likes,
        retweets_count: retweets
      });
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return arrangedData;
};

var arrangeReTweets = async function arrangeReTweets(items) {
  var arrangedData = [];

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var item = _step2.value;

      var data = await selectDataById('tweets', item.postid);

      arrangedData.push({
        content: data.content,
        retweet_user: item.username,
        tweet_id: item.postid,
        tweet_user: data.username,
        timestamp: item.timestamp
      });
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return arrangedData;
};

var countRows = async function countRows(tableName, id) {
  var result = await DB.query('SELECT count(*) FROM public.' + tableName + ' where postId=\'' + id + '\'\n  ');
  return result.rows[0].count;
};

var selectDataById = async function selectDataById(tableName, id) {
  var result = await DB.query('SELECT content,username FROM public.' + tableName + ' where id=\'' + id + '\'');

  return result.rows[0];
};