const apiRouter = require('express').Router(); 

apiRouter.use('/submissions', require('./Submission.js'));
apiRouter.use('/posts', require('./Post.js'));


module.exports = apiRouter;