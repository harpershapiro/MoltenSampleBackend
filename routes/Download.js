const express = require('express');
const router = express.Router();

router.route('/:packUrl').get(function(req,res){
    let packUrl = req.params.packUrl; 
    res.json({url: packUrl});
})

module.exports = router;