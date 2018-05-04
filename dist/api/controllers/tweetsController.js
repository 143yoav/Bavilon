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
var postIndex = 0;

async function init(db) {
  DB = db.collection('tweets');
  postIndex = await DB.count();
}

function listAllTweets(req, res) {
  DB.find({}).toArray(function (err, items) {
    res.send(arrangeTweets(items));
  });
}

async function postTweet(req, res) {
  var tweet = {
    username: req.body.username,
    content: req.body.content,
    id: postIndex,
    timestamp: isoTimeStamp(),
    likes: [],
    retweets: []
  };

  await insertToDB(tweet, res);
  postIndex++;
}

function likeTweet(req, res) {
  var details = { id: parseInt(req.params.id) };

  DB.findOne(details, function (err, item) {
    if (err) {
      res.send({ error: 'An error has occurred' });
    } else {
      if (item) {
        var query = {
          $addToSet: {
            likes: { username: req.body.username, timestamp: isoTimeStamp() }
          }
        };
        updateDB(details, query);
        res.end('success');
      }
    }
  });
}

function retweet(req, res) {
  var details = { id: parseInt(req.params.id) };

  DB.findOne(details, function (err, item) {
    if (err) {
      res.send({ error: 'An error has occurred' });
    } else {
      if (item) {
        DB.update(details, {
          $addToSet: {
            retweets: { username: req.body.username, timestamp: isoTimeStamp() }
          }
        });
        res.end('success');
      }
    }
  });
}

function listAllReTweets(req, res) {
  DB.find({}).toArray(function (err, items) {
    res.send(arrangeReTweets(items));
  });
}

var insertToDB = async function insertToDB(data, res) {
  await DB.insert(data, function (err, result) {
    if (err) {
      res.send({ error: 'An error has occurred' });
    } else {
      res.end('success');
    }
  });
};

var updateDB = async function updateDB(details, query) {
  await DB.update(details, query);
};

var isoTimeStamp = function isoTimeStamp() {
  return new Date(Date.now()).toISOString();
};

var arrangeTweets = function arrangeTweets(items) {
  var arrangedData = [];

  items.forEach(function (x) {
    arrangedData.push({
      id: x.id,
      username: x.username,
      timestamp: x.timestamp,
      content: x.content,
      likes_count: x.likes.length,
      retweets_count: x.retweets.length
    });
  });

  return arrangedData;
};

var arrangeReTweets = function arrangeReTweets(items) {
  var arrangedData = [];

  items.forEach(function (tweet) {
    tweet.retweets.forEach(function (retweet) {
      arrangedData.push({
        content: tweet.content,
        retweet_user: retweet.username,
        tweet_id: tweet.id,
        tweet_user: tweet.username,
        timestamp: retweet.timestamp
      });
    });
  });

  return arrangedData;
};