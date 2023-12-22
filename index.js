const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ErrorHandler = require('./ErrorHandler');

//model
const Product = require('./models/product')

//template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'))

function wrapAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(err => next(err))
    }
}

//koneksi ke mongo
mongoose.connect('mongodb://127.0.0.1/shop_db').then((result) => {
    console.log('connected to mongodb')
}).catch((err) => {
    console.log(err)
});



//route
app.get('/', (req, res) => {
    res.send('ok');
})

app.get('/products', async(req, res) => {
    const {category} = req.query
    if(category) {
        const products = await Product.find({category});
        res.render('products/index', {
            products,
            category
        });
   } else {
    const products = await Product.find({});
    res.render('products/index', {
        products,
        category: 'All'
    });
   }
});

//form tambah data
app.get('/products/create', async (req, res) => {
    res.render('products/create')
});

app.post('/products', wrapAsync(async(req, res) => {
    const product = new Product(req.body)
    await product.save()
    res.redirect(`/products/${product._id}`)
}));

app.get('/products/:id', wrapAsync(async (req, res) => {

        const {id} = req.params
        const product = await Product.findById(id)
        res.render('products/show', {
        product,
        })    
    })
);

//form edit
app.get('/products/:id/edit', wrapAsync(async(req, res) => {
        const {id} = req.params
        const product = await Product.findById(id)
        res.render('products/edit', {
            product
        })  
}));

app.put('/products/:id', wrapAsync(async(req, res, next) => {
        const {id} = req.params
        const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true})
        res.redirect(`/products/${product._id}`)
}));

app.delete('/products/:id', wrapAsync(async(req, res) => {
    const {id} = req.params
    await Product.findByIdAndDelete(id);
    res.redirect('/products')
}));

const validationHandler = err => {
    err.status = 400
    err.message = Object.values(err.errors).map(item => item.message)
    return new ErrorHandler(err.status, err.message)
}

app.use((err, req, res, next) => {
    console.dir(err)
    if(err.name === 'ValidationError') err = validationHandler(err)
    
    if(err.name === 'CastError') {
        err.status = 404
        err.message = 'Page not found'
    }
    next(err)    
})

app.use((err, req, res, next) => {
    const {status = 500, message} = err
    res.status(status).send(message);
}) ;

app.listen(3000, () => {
    console.log('shop app listening on http://127.0.0.1:3000');
});