const Order = require('../../modals/order')
const Product = require('../../modals/product')
const mongoose = require('mongoose')


exports.orders_get_all = (req, res, next) => {
    Order.find({}, {product: true, _id: true, quantity: true}).populate('product', {_id: true, name: true, price: true}).exec((err, result) => {
        if (err) {
            res.status(500).json({
                error: err
            })
        }else {
            res.status(200).json({
                count: result.length,
                orders: result.map(result => {
                    return {
                        _id: result._id,
                        product: result.product,
                        quantity: result.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + result._id
                        }
                    }
                })
            })
        }
    })
}

exports.orders_create_order = (req, res, next) => {
    Product.findOne({_id: req.body.product}, {}, (err, result) => {
        if (!result) {
            res.status(500).json({
                message: 'Product not found',
                error: err
            })
        }else {
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            })
            order.save((err, result) => {
                if (err) {
                    res.status(500).json({
                        error: err
                    })
                }else {
                    res.status(201).json({
                        message: 'Order Stored',
                        createdOrder: {
                            _id: result.id,
                            product: result.product,
                            quantity: result.quantity
                        },
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + result._id
                        }
                    })
                }
            })
        }
    })
}

exports.orders_get_order = (req, res, next) => {
    const _id = req.params.orderId
    Order.findOne({_id: _id}, {_id: true, product: true, quantity: true}).populate('product', {_id: true, name: true, price: true}).exec((err, result) => {
        if (!result) {
            res.status(404).json({
                error: 'Order not found'
            })
        }else {
            res.status(200).json({
                order: result,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            })
        }
    })
}

exports.orders_delete_order = (req, res, next) => {
    const _id = req.params.orderId
    Order.remove({_id: _id}, (err, result) => {
        if (err) {
            res.status(200).json({
                error: err
            })
        }else {
            res.status(200).json({
                type: 'POST',
                url: 'http://localhost:3000/orders/',
                body: {product: 'ID', quantity: 'Number'}
            })
        }
    })
}