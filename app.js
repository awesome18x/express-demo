const express = require('express');
const app = express();

app.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Everythisng is OK!'
    });
});

module.exports = app;