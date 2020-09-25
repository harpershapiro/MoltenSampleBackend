const apiRouter = require('express').Router(); 

apiRouter.use('/submissions', require('./Submission.js'));

module.exports = apiRouter;