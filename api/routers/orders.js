const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('./../models/orders');

router.get('/', (req, res, next) => {
    Order.find()
        .populate('product')
        .exec()
        .then(orders => {
            res.status(200).json({
                count: orders.length,
                Order: orders.map(order => {
                    return {
                        _id: order._id,
                        product: order.product,
                        quantity: order.quantity
                    }
                })
            });
        })
        .catch(error => {
            console.log(error);
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