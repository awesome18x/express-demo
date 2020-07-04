const express = require('express');
const router = express.Router();

router.get('', (req, res, next) => {
    res.status(201).json({
        msg: 'Order availabel'
    });
});

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    };
    res.status(201).json({
        msg: 'Order was created!',
        order: order
    });
});

module.exports = router;