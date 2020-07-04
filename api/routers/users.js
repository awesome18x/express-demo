const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const User = require('./../models/users');

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user) {
                res.status(409).json({
                    msg: 'User existed'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(user => {
                                res.status(201).json({
                                    msg: 'User created',
                                    user: user
                                });
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                });
            }

        })
        .catch(error => {
            console.log(error);
        })




});

module.exports = router;