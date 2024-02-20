const Coupon = require('../models/couponModel')
const asyncHandler = require('express-async-handler')

const createNewCoupon = asyncHandler(async (req, res) => {
    const { name_coupon, disscount, expiry } = req.body
    if (!name_coupon || !disscount || !expiry) throw new Error('Missing inputs')
    const response = await Coupon.create({
        ...req.body,
        expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000
    })
    return res.json({
        success: response ? true : false,
        createCoupon: response ? response : 'Cannot create new Coupon'
    })
})

const getCoupon = asyncHandler(async (req, res) => {
    const response = await Coupon.find().select('-createdAt -updatedAt')
    return res.json({
        success: response ? true : false,
        coupons: response ? response : 'Cannot get coupons'
    })
})

const updateCoupon = asyncHandler(async (req, res) => {
    const { couponId } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if (req.body.expiry) req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000
    const response = await Coupon.findByIdAndUpdate(couponId, req.body, { new: true })
    return res.json({
        success: response ? true : false,
        updatedCoupon: response ? response : 'Cannot update coupon'
    })
})

const deleteCoupon = asyncHandler(async (req, res) => {
    const { couponId } = req.params
    const response = await Coupon.findByIdAndDelete(couponId)
    return res.json({
        success: response ? true : false,
        deletedCoupon: response ? response : 'Cannot delete coupon'
    })
})

module.exports = {
    createNewCoupon,
    getCoupon,
    updateCoupon,
    deleteCoupon
}