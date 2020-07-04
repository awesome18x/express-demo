const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('./../models/products');

router.get('/', (req, res) => {
    Product.find()
        .exec()
        .then(products => {
            const response = {
                count: products.length,
                products: products.map(product => {
                    return {
                        name: product.name,
                        price: product.price,
                        _id: product._id,
                        request: {
                            type: 'GET'
                        }
                    }
                })
            };
            return res.status(200).json({
                msg: 'Successfully',
                response
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

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete(':/productID', (req, res, next) => {
    const id = req.params.productID;
    Product.findByIdAndRemove({ id })
        .exec()
        .then(product => {
            console.log(product);
        })
        .catch(error => {
            console.log('Error', error);
        });
});

module.exports = router;