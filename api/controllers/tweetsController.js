let DB = null;
let postIndex = 0;

export async function init(db) {
  DB = db.collection('tweets');
  postIndex = await DB.count();
}

export function listAllTweets(req, res) {
  DB.find({}).toArray((err, items) => {
    res.send(arrangeTweets(items));
  });
}

export async function postTweet(req, res) {
  const tweet = {
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

export function likeTweet(req, res) {
  const details = { id: parseInt(req.params.id) };

  DB.findOne(details, (err, item) => {
    if (err) {
      res.send({ error: 'An error has occurred' });
    } else {
      if (item) {
        const query = {
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

export function retweet(req, res) {
  const details = { id: parseInt(req.params.id) };

  DB.findOne(details, (err, item) => {
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

export function listAllReTweets(req, res) {
  DB.find({}).toArray((err, items) => {
    res.send(arrangeReTweets(items));
  });
}

const insertToDB = async (data, res) => {
  await DB.insert(data, (err, result) => {
    if (err) {
      res.send({ error: 'An error has occurred' });
    } else {
      res.end('success');
    }
  });
};

const updateDB = async (details, query) => {
  await DB.update(details, query);
};

const isoTimeStamp = () => new Date(Date.now()).toISOString();

const arrangeTweets = items => {
  let arrangedData = [];

  items.forEach(x => {
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

const arrangeReTweets = items => {
  let arrangedData = [];

  items.forEach(tweet => {
    tweet.retweets.forEach(retweet => {
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
