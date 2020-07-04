const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('./../models/orders');

router.get('/', (req, res, next) => {
    res.status(201).json({
        msg: 'Order availabel'
    });
});

router.post('/', (req, res, next) => {
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });
    order.save()
        .then(order => {
            res.status(201).json({
                msg: 'Order was created!',
                order: order
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });

});

module.exports = router;