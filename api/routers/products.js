const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('./../models/products');

router.get('/', (req, res) => {
    Product.find()
        .exec()
        .then(products => {
            return res.status(200).json({
                msg: 'Successfully',
                products: products
            });
        })
        .catch(error => {
            console.log(error);
        });

});

router.post('/', (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price
    });

    product
        .save()
        .then(result => {
            return res.status(201).json({
                msg: 'Created product OK',
                createdProduct: product
            });
        })
        .catch(error => {
            console.log(error);
        });

});

router.get('/:productID', (req, res, next) => {
    const id = req.params.productID;
    Product.findById(id)
        .exec()
        .then(product => {
            if (!product) {
                res.status(400).json({
                    msg: `Dont find product with id: ${id}`
                });
            }
            res.status(200).json({
                msg: 'Have a prooduct',
                product: product
            });
        })
        .catch(error => {
            console.log(error);
        });

});

router.patch(':/productID', (req, res, next) => {
    const id = req.params.productID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product
        .update({ _id: id }, { $set: updateOps })
        .exec()
        .then(product => {
            return res.status(200).json({
                msg: 'Update successfully',
                product: product
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                msg: 'Have a error',
                error: error
            });
        });
    res.status(200).json({
        msg: 'Product updated!'
    });
});

router.delete(':/productID', (req, res, next) => {
    const id = req.params.productID;
    Product.remove({ _id: id })
        .exec()
        .then()
        .catch()
});

module.exports = router;