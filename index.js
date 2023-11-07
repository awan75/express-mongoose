const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//koneksi ke mongo
mongoose.connect('mongodb://127.0.0.1/shop_db').then((result) => {
    console.log('connected to mongodb')
}).catch((err) => {
    console.log(err)
})

//route
app.get('/', (req, res) => {
    res.send('ok');
})

app.listen(3000, () => {
    console.log('shop app listening on http://127.0.0.1:3000');
});