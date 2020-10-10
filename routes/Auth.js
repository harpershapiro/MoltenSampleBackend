const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../config');
const bodyParser = require('body-parser');
const router = express.Router();
const User = require('../models/user.model');

router.use(bodyParser.json())

router.post('/sign-up', (req,res) => {
    //const {username, password} = req.body;
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password)
        res.status(400).send('Please provide both a username and a password.');

        User.findOne({username})
            .then(user=> {
                if(user){
                    return res.status(403).json({code:403, response: 'User already exists.'});
                }
                
                //hash password and save new user
                bcrypt.genSalt(5)
                    .then(salt => bcrypt.hash(password,salt))
                    .then(hashPass =>  new User({user_name: username, user_pass: hashPass}).save())
                    .then(newUser => {
                        newUser = newUser.toObject();
                        delete newUser['user_pass'];

                        //sign token
                        const token = jwt.sign({
                                data: newUser,
                                exp: Math.floor(Date.now() /1000) + (60*60)
                            }, SECRET_KEY)

                        res.status(200).json({
                            code:200,
                            response: {
                                token,
                                ...newUser
                            }
                        })
                    }).catch(e=> res.send(500).json({error: 'There was an error.'}));

            }).catch(e=> res.send(500).json({error: 'There was an error.'}));
    
})

router.post('/sign-in', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
        res.status(400).send('Please provide both a username and a password.');
    }
    
    //find user by username and compare passwords
    User.findOne({user_name: username})
        .select('+user_pass')
        .then(user => {
            if(!user)
                res.status(404).json({code: 404, message: 'User not found'})

                bcrypt.compare(password,user.user_pass)
                    .then(successLogged => !successLogged ? res.status(403).json({code: 403, message: 'Invalid password'}) : user )
                    //sign token 
                    .then(user =>
                            jwt.sign({
                                data: user,
                                exp: Math.floor(Date.now() / 1000) + (60 * 60)
                            }, SECRET_KEY))
                    .then(token => {
                        user = user.toObject();
                        delete user['user_pass'];

                        res.status(200).json({
                            code: 200,
                            response: {
                                token,
                                ...user
                            }
                        
                        });
                        console.log(`Signed in ${username}`);
                    })
                    .catch(e => res.send(500).json({error: 'There was an error.'}));
        })
        .catch(e => res.send(500).json({error: 'There was an error.'}));

});

//only updates username and/or roles
router.post('/updateinfo/:username', (req,res)=>{
    let username = req.params.username;
    User.findOne({user_name: username})
        .then(user=>{
            if(!user){
                res.status(404).send("user not found");
            } else {
                user.user_name=req.body.user_name;
                user.user_roles=req.body.user_roles;

                user.save().then(user=>{
                    res.json("User updated.");
                })
                .catch(e=>{
                    res.status(400).send("Update not possible.");
                });
            }
        })
    });

router.get('/', (req,res) => {
    User.find((err, users)=>{
        if(err){
            console.log(err);
        } else {
            res.json(users);
        }
    })
})


module.exports = router;