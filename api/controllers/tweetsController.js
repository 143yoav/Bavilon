let DB = null;

export function init(db) {
  DB = db;
}

export async function listAllTweets(req, res) {
  const result = await DB.query('SELECT * FROM public.tweets');
  let rows = [];
  result.rows.forEach(x => {
    rows.push(x);
  });
  const data = await arrangeTweets(rows);
  res.send(data);
}

export function postTweet(req, res) {
  DB.query(
    `INSERT INTO public.tweets(username, content, "timestamp") VALUES('${
      req.body.username
    }','${req.body.content}','${isoTimeStamp()}')`
  ).then(
    result => {
      res.end('success');
    },
    reason => {
      console.log(reason);
    }
  );
}

export function likeTweet(req, res) {
  DB.query(
    `INSERT INTO public.likes(postid, username, "timestamp") VALUES(${parseInt(
      req.params.id
    )},'${req.body.username}','${isoTimeStamp()}')`
  ).then(
    result => {
      res.end('success');
    },
    reason => {
      console.log(reason);
    }
  );
}

export function retweet(req, res) {
  const details = { id: parseInt(req.params.id) };
  DB.query(
    `INSERT INTO public.retweets(postid, username, "timestamp") VALUES(${parseInt(
      req.params.id
    )},'${req.body.username}','${isoTimeStamp()}')`
  ).then(
    result => {
      res.end('success');
    },
    reason => {
      console.log(reason);
    }
  );
}

export async function listAllReTweets(req, res) {
  const result = await DB.query('SELECT * FROM public.retweets');
  let rows = [];
  result.rows.forEach(x => {
    rows.push(x);
  });
  const data = await arrangeReTweets(rows);
  res.send(data);
}

const isoTimeStamp = () => new Date(Date.now()).toISOString();

const arrangeTweets = async items => {
  let arrangedData = [];

  for (let item of items) {
    const likes = await countRows('likes', item.id);
    const retweets = await countRows('retweets', item.id);

    arrangedData.push({
      id: item.id,
      username: item.username,
      timestamp: item.timestamp,
      content: item.content,
      likes_count: likes,
      retweets_count: retweets
    });
  }

  return arrangedData;
};

const arrangeReTweets = async items => {
  let arrangedData = [];

  for (let item of items) {
    const data = await selectDataById('tweets', item.postid);

    arrangedData.push({
      content: data.content,
      retweet_user: item.username,
      tweet_id: item.postid,
      tweet_user: data.username,
      timestamp: item.timestamp
    });
  }

  return arrangedData;
};

const countRows = async (tableName, id) => {
  const result = await DB.query(
    `SELECT count(*) FROM public.${tableName} where postId='${id}'
  `
  );
  return result.rows[0].count;
};

const selectDataById = async (tableName, id) => {
  const result = await DB.query(
    `SELECT content,username FROM public.${tableName} where id='${id}'`
  );

  return result.rows[0];
};
