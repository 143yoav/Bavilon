export default async function(client) {
  await client.query(
    'CREATE TABLE IF NOT EXISTS tweets (ID SERIAL PRIMARY KEY,username VARCHAR,content VARCHAR,timestamp VARCHAR)'
  );
  await client.query(
    'CREATE TABLE IF NOT EXISTS retweets (postId INTEGER,username VARCHAR,timestamp VARCHAR)'
  );
  await client.query(
    'CREATE TABLE IF NOT EXISTS likes (postId INTEGER,username VARCHAR,timestamp VARCHAR)'
  );
}
