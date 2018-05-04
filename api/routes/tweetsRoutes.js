export default (app, db) => {
  const controller = require('../controllers/tweetsController');
  controller.init(db);

  app
    .route('/tweets')
    .get(controller.listAllTweets)
    .post(controller.postTweet);
  app.route('/tweets/:id/likes').post(controller.likeTweet);
  app.route('/tweets/:id/retweet').post(controller.retweet);
  app.route('/retweets').get(controller.listAllReTweets);
};
