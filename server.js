import express from 'express';
import routes from './api/routes/tweetsRoutes';
import bodyParser from 'body-parser';
import dbConfig from './config/db';
import pg from 'pg';

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connectionString = process.env.connection_string;
const client = new pg.Client(connectionString);
client.connect().then(
  async val => {
    await dbConfig(client);

    routes(app, client);
    app.listen(port, () => console.log('Live on : ', port));
  },
  reason => {
    console.log(reason);
  }
);
