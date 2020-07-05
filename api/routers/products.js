const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('./../middleware/check-auth');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});

const Product = require('./../models/products');

router.get('/', checkAuth, (req, res) => {
    const pageSize = +req.query.pageSize;
    const pageIndex = +req.query.pageIndex;
    Product.find()
        .skip((pageSize * pageIndex) - pageSize)
        .limit(pageSize)
        .sort('name')
        .exec()
        .then(products => {
            const response = {
                count: products.length,
                products: products.map(product => {
                    return {
                        name: product.name,
                        price: product.price,
                        productImage: product.productImage,
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

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
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

router.get('/:productID', checkAuth, (req, res, next) => {
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

router.patch('/:productId', checkAuth, (req, res, next) => {
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

router.delete(':/productID', checkAuth, (req, res, next) => {
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