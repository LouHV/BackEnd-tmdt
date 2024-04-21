'use strict';

const convertToObjectIdMongoDb = require('../ultils/index')

const Carts = require('../models/cart')
const User = require("../models/userModel")
const Coupon = require("../models/couponModel")
const Product = require("../models/productModel")

const asyncHandler = require('express-async-handler')


const getCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    let cart = await Carts.findOne({ cart_userId: _id });

    if (!cart) {
        cart = new Carts({
            cart_userId: _id,
            cart_state: 'pending',
            cart_products: [],
            cart_count_product: 0,
        });
        await cart.save();
    }

    return res.json({
        success: cart ? true : false,
        cart: cart ? cart : 'Something went wrong'
    })
});

const addProductToCart = asyncHandler(async (req, res) => {
    const { productId, quantity, color, price } = req.body;
    const { _id } = req.user;
    const userId = _id;

    let cart = await Carts.findOne({ cart_userId: userId });
    if (!cart) {
        cart = new Carts({
            cart_userId: userId,
            cart_state: 'active',
            cart_products: [],
            cart_count_product: 0,
        });
    }

    const productIndex = cart.cart_products.findIndex(p => p.product.toString() == productId && p.color === color);
    if (productIndex !== -1) {
        cart.cart_products[productIndex].quantity += quantity;
        cart.cart_products[productIndex].price += price;
    } else {
        const product = await Product.findById(productId);
        console.log('product :>> ', product);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        cart.cart_products.push({
            product: productId,
            quantity: quantity,
            color: color,
            price: price,
            thumb: product.thumb,
            title: product.title
        });
    }

    cart.cart_count_product = cart.cart_products.reduce((acc, product) => acc + product.quantity, 0);
    cart.cart_state = 'active';

    const rs = await cart.save();

    if (!rs) {
        return res.status(404).json({ success: false, message: 'Add Product to cart not found' });
    }

    return res.json({
        success: true,
        cart: rs
    });
});

const updateCartQuantity = asyncHandler(async (req, res) => {

    const { _id } = req.user;
    const { productId, quantity, price } = req.body;

    const cart = await Carts.findOne({ cart_userId: _id });
    if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const productIndex = cart.cart_products.findIndex(p => {
        return p.product.toString() == convertToObjectIdMongoDb(productId).toString();
    });

    if (productIndex == -1) {
        return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    cart.cart_products[productIndex].quantity = quantity;
    cart.cart_products[productIndex].price = price;
    cart.cart_count_product = cart.cart_products.reduce((acc, product) => acc + product.quantity, 0);

    const rs = await cart.save();

    if (!rs) {
        return res.status(404).json({ success: false, message: 'Cart updated successfully' });
    }

    return res.json({
        success: true,
        cart: rs
    });
});

const deleteCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { productId } = req.body;

    const cart = await Carts.findOne({ cart_userId: _id });
    if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const productIndex = cart.cart_products.findIndex(p => {
        console.log('p.product.toString() :>> ', p.product.toString());
        console.log('convertToObjectIdMongoDb(productId).toString() :>> ', convertToObjectIdMongoDb(productId).toString());

        return p.product.toString() == convertToObjectIdMongoDb(productId).toString();
    });

    if (productIndex == -1) {
        return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    cart.cart_products.splice(productIndex, 1);
    cart.cart_count_product = cart.cart_products.reduce((acc, product) => acc + product.quantity, 0);

    const rs = await cart.save();

    if (!rs) {
        return res.status(404).json({ success: false, message: 'Cart updated successfully' });
    }

    return res.json({
        success: true,
        cart: rs
    });
});

module.exports = {
    getCart,
    deleteCart,
    addProductToCart,
    updateCartQuantity,
}
