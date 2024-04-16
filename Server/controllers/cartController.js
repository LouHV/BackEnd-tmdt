const Carts = require('../models/cart')
const User = require("../models/userModel")
const Coupon = require("../models/couponModel")
const Product = require("../models/productModel")

const asyncHandler = require('express-async-handler')


const getCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    // const { cartId } = req.params;
    const cart = await Carts.findOne({ cart_userId: _id });
    if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    // res.status(200).json({ success: true, cart });
    return res.json({
        success: cart ? true : false,
        cart: cart ? cart : 'Something went wrong'
    })
});

const deleteCart = asyncHandler(async (req, res) => {
    console.log('req :>> ', req);
    const { _id } = req.user;
    const { cartId } = req.params
    const response = await Carts.findByIdAndUpdate(_id, { $pull: { cart_products: { _id: cartId } } }, { new: true })
    console.log('response :>> ', response);
    // const result = await Carts.deleteOne({ cart_userId: _id });
    // if (result.deletedCount === 0) {
    //     return res.status(404).json({ success: false, message: 'Cart not found' });
    // }
    res.status(200).json({ success: true, message: 'Cart deleted successfully' });
});


const addProductToCart = asyncHandler(async (req, res) => {
    const { productId, quantity, color } = req.body;
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

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng hay chưa
    const productIndex = cart.cart_products.findIndex(p => p.product.toString() === productId && p.color === color);
    if (productIndex !== -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        cart.cart_products[productIndex].quantity += quantity;
    } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm vào giỏ hàng
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        cart.cart_products.push({
            product: productId,
            quantity: quantity,
            color: color,
            price: product.price,
            thumb: product.thumb,
            title: product.title
        });
    }

    // Cập nhật tổng số lượng sản phẩm trong giỏ hàng
    cart.cart_count_product = cart.cart_products.reduce((acc, product) => acc + product.quantity, 0);

    // Lưu giỏ hàng
    const rs = await cart.save();

    if (!rs) {
        return res.status(404).json({ success: false, message: 'Add Product to cart not found' });
    }

    // res.status(200).json({ success: true, cart });
    return res.json({
        success: rs ? true : false,
        cart: cart ? cart : 'Something went wrong'
    })
});

const updateCartQuantity = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { productId, quantity } = req.body;

    const cart = await Carts.findOne({ cart_userId: _id });
    if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const productIndex = cart.cart_products.findIndex(p => p.product.toString() == productId);
    if (productIndex === -1) {
        return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    cart.cart_products[productIndex].quantity = quantity;
    await cart.save();

    return res.status(200).json({ success: true, message: 'Cart updated successfully' });
});

module.exports = {
    getCart,
    deleteCart,
    addProductToCart,
    updateCartQuantity,
}
