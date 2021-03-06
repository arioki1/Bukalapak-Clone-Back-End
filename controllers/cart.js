'use strict';
const response = require('../libs/response');
const userModel = require('../models/users');
const productModel = require('../models/products');
const cartModel = require('../models/cart');

const _ = require('lodash');
const helper = require('../libs/helper');

exports.getCart = async (req, res) => {

    const token = helper.decodeJwt(req.header('x-auth-token'));

    if (!token._id) {
        return response.error('error get data user', res);
    }

    let usersId = token._id;

    await cartModel.find({user: usersId})
        .populate({path: 'product', model: 'Product'})
        .exec()
        .then(data => {
            response.success(data, res);
        })
        .catch(err => {
            response.error('error get data cart', res);
        });
};
exports.addCart = async function (req, res) {
    const token = helper.decodeJwt(req.header('x-auth-token'));

    if (!token._id) {
        return response.error('error get data user', res);
    }

    let user = token._id;

    //input from request
    let product = req.body.productId;

    const cart = new cartModel({
        user,
        product
    });

    try {
        let idUser = await userModel.findById({_id: user});

        if (!idUser) {
            return response.error('error get data users', res);
        }
    } catch (e) {
        return response.error('error get data users', res);
    }

    await cart.save()
        .then(data => {
            let json = {
                message: 'success add data Cart',
                data: data
            };

            response.success(json, res)
        })

        .catch(err => {
            let json = {
                status: 500,
                message: 'Error add data Cart'
            };

            response.error(json, res)
        })
};
exports.deleteCart = async (req, res) => {
    let id = req.params.id;
    const token = helper.decodeJwt(req.header('x-auth-token'));

    if (!token._id) {
        return response.error('error get data user', res);
    }

    cartModel.deleteOne(
        {
            product: id,
            user: token._id
        },
    ).then(data=>{
        response.success({id: id}, res)
    }).catch(e=>{
        response.error(e,res)
    })

};

