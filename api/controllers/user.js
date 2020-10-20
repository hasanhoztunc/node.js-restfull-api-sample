const mongoose = require('mongoose')
const bycrpt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../../modals/user')

exports.user_signup = (req, res, next) => {
    User.findOne({email: req.body.email}, {}, (err, result) => {
        if (!result) {
            bycrpt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                } else {
                    const user = User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })
                    user.save((err, result) => {
                        if (err) {
                            return res.status(500).json({
                                error: err
                            })
                        }else {
                            console.log(result)
                            res.status(201).json({
                                message: 'User Created'
                            })
                        }
                    })
                }
            })
        } else {
            res.status(409).json({
                error: 'Email exists'
            })
        }
    })
}

exports.user_login = (req, res, next) => {
    User.findOne({email: req.body.email}, {}, (err, result) => {
        if (!result) {
            return res.status(401).json({
                error: 'Auth failed'
            })
        }else {
            bycrpt.compare(req.body.password, result.password, (error, comp) => {
                if (comp) {
                    const token = jwt.sign(
                                {
                                    email: result.email,
                                    userId: result._id
                                }, 
                                    process.env.JWT_KEY, 
                                {
                                    expiresIn: "1h"
                                },
                            )
                    res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    })
                } else {
                    res.status(401).json({
                        message: 'Auth failed'
                    })
                }
            })
        }
    })
}

exports.user_delete_user = (req, res, next) => {
    User.remove({_id: req.params.userId}, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err
            })
        }else {
            res.status(200).json({
                message: 'User deleted'
            })
        }
    })
}