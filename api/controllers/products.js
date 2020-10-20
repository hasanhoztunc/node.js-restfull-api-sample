const mongoose = require('mongoose')
const Product = require('../../modals/product')

exports.products_get_all = (req, res, next) => {
    Product.find({},{_id: true, name: true, price: true}, (err, result) => {
        if (err) {
            res.status(404).json({
                error: err
            })
        }else {
            const response = {
                count: result.length,
                products: result.map(result => {
                    return {
                        name: result.name,
                        price: result.price,
                        _id: result._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + result._id
                        }
                    }
                })
            }
            res.status(200).json(response)
        }
    })
}

exports.products_create_product = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    })

    product.save((err, newPost) => {
        if (err) {
            res.status(500).json({
                error: err
            })
        }else {
            res.status(201).json({
                message: 'Handling POST request to /products',
                cretedProduct: {
                    name: newPost.name,
                    price: newPost.price,
                    _id: newPost._id,
                    requrest: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + newPost._id
                    }
                }
            })
        }
    })    
}

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId
    Product.findOne({_id: id}, {_id: true, name: true, price: true}, (err, post) => {
        if (err) {
            console.log(err)
            res.status(500).json({
                error: err
            })
        } else {
            if (post) {
                res.status(200).json({
                    product: post,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products'
                    }
                })
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                })
            }
        }
    })
}

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Product.update(
        {_id : id}, 
        {
            $set: updateOps
        },
        (err, result) => {
            if (err) {
                res.status(500).json({
                    error: err
                })
            } else {
                res.status(200).json({
                    message: 'Product Updated',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + id
                    }
                })
            }
        }    
    ) 
}

exports.product_delete_product = (req, res, next) => {
    const _id = req.params.productId
    Product.remove({_id: _id} ,(err, result) => {
        if (err) {
            res.status(500).json({
                error: err
            })
        }else {
            res.status(200).json({
                message: 'Product Deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/',
                    body: {name: 'String', price: 'Number'}
                }
            })
        }
    })
}