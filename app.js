const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const productRoutes = require('./api/routers/products');
const orderRoutes = require('./api/routers/orders');

mongoose
    .connect('mongodb://localhost:27017/express-demo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Ket noi toi Database OK!')
    })
    .catch(error => {
        console.log('Error khi ket noi DB', error);
    });
app.use(logger('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Accept-Control-Allow-Methods', 'POST, PUT, PATCH, DELETE, GET');
        res.status(200).json({});
    }
    next();
});

app.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Everythisng is OK!'
    });
});

app.use('/product', productRoutes);
app.use('/order', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;