import express from 'express';
import routes from './api/routes/tweetsRoutes';
import bodyParser from 'body-parser';
import mongodb from 'mongodb';

const port = process.env.PORT || 3000;
const app = express();
const dbClient = mongodb.MongoClient;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connectionString = process.env.connection_string;

dbClient.connect(connectionString, async (err, database) => {
  if (err) {
    console.log(err);
  } else {
    let isValid = await validateDataBase(database.db('tweets_db'));
    if (isValid) {
      routes(app, database.db('tweets_db'));
      app.listen(port);
      console.log('We are live on port ', port);
    } else {
      console.log('DB is not valid');
    }
  }
});

const validateDataBase = async db => {
  let result = false;
  const cols = await db.listCollections().toArray();

  cols.forEach(element => {
    if (element.name == 'tweets') {
      result = true;
    }
  });

  return result;
};
