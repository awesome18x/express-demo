const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('./../models/users');

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    msg: `Mail not found, user doesn't exist`
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(404).json({
                        msg: `Auth fail`
                    });
                }
                if (result) {
                    const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        'secret', {
                            "expiresIn": "1h"
                        });

                    return res.status(200).json({
                        msg: 'Login successfuly',
                        token: token
                    });
                }
            })

        })
})

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
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