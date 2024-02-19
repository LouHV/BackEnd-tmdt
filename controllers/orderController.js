const Order = require('../models/oderModel')
const User = require("../models/userModel")
const Coupon = require("../models/couponModel")

const asyncHandler = require('express-async-handler')


const createNewOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { coupon } = req.body
    const userCart = await User.findById(_id).select('cart').populate('cart.product', 'title price')
    const products = userCart?.cart?.map(el => ({
        product: el.product._id,
        count: el.quantity,
        color: el.color
    }))
    let total = userCart?.cart?.reduce((sum, el) => el.product.price * el.quantity + sum, 0)
    const createData = { products, total, oderBy: _id }
    if (coupon) {
        const selectedCoupon = await Coupon.findById(coupon)
        total = Math.round(total * (1 - +selectedCoupon?.disscount / 100) / 1000) * 1000 || total
        createData.total = total
        createData.coupon = coupon
    }
    const rs = await Order.create(createData)
    return res.json({
        success: rs ? true : false,
        createdOrder: rs ? rs : 'Cannot create new Order',
        userCart
    })
})

const updateStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params
    const { status } = req.body
    if (!status) throw new Error('Missing Status')
    const response = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
    return res.json({
        success: response ? true : false,
        createdOrder: response ? response : 'Something went wrong',
        userCart
    })
})

const getUserOder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const response = await Order.find({ oderBy: _id })
    return res.json({
        success: response ? true : false,
        createdOrder: response ? response : 'Something went wrong',
        userCart
    })
})

const getOders = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const response = await Order.find()
    return res.json({
        success: response ? true : false,
        createdOrder: response ? response : 'Something went wrong',
        userCart
    })
})

module.exports = {
    createNewOrder,
    updateStatus,
    getUserOder,
    getOders
}