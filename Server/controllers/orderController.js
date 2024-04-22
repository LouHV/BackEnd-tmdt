const Order = require('../models/oderModel')
const User = require("../models/userModel")
const Coupon = require("../models/couponModel")
const Product = require("../models/productModel")
const Carts = require('../models/cart')

const asyncHandler = require('express-async-handler')


const createNewOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { products, total, address, status, discountedTotal } = req.body
    if (address) {
        await User.findByIdAndUpdate(_id, { address, cart: [] })
    }
    const data = { products, total, orderBy: _id }
    if (status) data.status = status
    if (discountedTotal) data.discountedTotal = discountedTotal
    const rs = await Order.create(data)
    const orderedProducts = rs.products;
    for (const product of orderedProducts) {
        const productInfo = await Product.findById(product.product);
        const newQuantity = productInfo.quantity - product.quantity;

        // Tăng sold lên
        const newSold = +productInfo.sold + +product.quantity;

        await Product.findByIdAndUpdate(product.product, {
            quantity: newQuantity,
            sold: newSold
        });
    }
    await Carts.deleteOne({ cart_userId: _id });
    return res.json({
        success: rs ? true : false,
        rs: rs ? rs : 'Something went wrong'
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
    })
})

const getUserOder = asyncHandler(async (req, res) => {
    let queryCommand = Order.find();
    const queries = { ...req.query };
    const { _id } = req.user
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(el => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`);
    const formattedQueries = JSON.parse(queryString);

   
    const qr = { ...formattedQueries, orderBy: _id }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    const page = +req.query.page || 1; // Dấu + sẽ chuyển STRING sang number
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;

    queryCommand = queryCommand.skip(skip).limit(limit);

    try {
        const response = await queryCommand.find(qr)
        const counts = await Order.countDocuments(qr);
        console.log('response :>> ', response);
        return res.status(200).json({
            success: response ? true : false,
            counts,
            Orders: response ? response : 'Cannot get Users',
        });
    } catch (err) {
        throw new Error(err.message);
    }
})

const getOders = asyncHandler(async (req, res) => {
    let queryCommand = Order.find();
    const queries = { ...req.query };
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(el => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`);
    const formattedQueries = JSON.parse(queryString);

    const qr = { ...formattedQueries }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    const page = +req.query.page || 1; // Dấu + sẽ chuyển STRING sang number
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;

    queryCommand = queryCommand.skip(skip).limit(limit);

    try {
        const response = await queryCommand.find(qr).populate({
            path: 'orderBy',
            select: 'firstname lastname avatar'
        })
        const counts = await Order.countDocuments(qr);
        return res.status(200).json({
            success: response ? true : false,
            counts,
            Orders: response ? response : 'Cannot get Users',
        });
    } catch (err) {
        throw new Error(err.message);
    }
})
const getOrdersCountByDate = asyncHandler(async (req, res) => {
    const { dateType, dateValue } = req.query; // dateType can be 'day', 'month', or 'year'
    const dateField = dateType === 'day' ? '$date' : dateType === 'month' ? { $month: '$date' } : { $year: '$date' };
    console.log('dateField :>> ', dateField);
    const pipeline = [
        {
            $match: {
                date: {
                    $gte: new Date(dateValue),
                    $lt: new Date(new Date(dateValue).setMonth(new Date(dateValue).getMonth() + 1))
                }
            }
        },
        {
            $group: {
                _id: dateField,
                count: { $sum: 1 }
            }
        }
    ];

    try {
        const response = await Order.aggregate(pipeline);
        return res.status(200).json({
            success: true,
            data: response
        });
    } catch (err) {
        throw new Error(err.message);
    }
});


const applyCouponToOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { couponCode } = req.body;

    const coupon = await Coupon.findOne({ coupon_code: couponCode, expiry: { $gte: new Date() } });
    if (!coupon) {
        return res.status(400).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    const order = await Order.findOne({ orderBy: _id, status: 1 });
    if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }

    let discountedTotal = order.total;
    if (coupon.type_coupon === 'Percent') {
        discountedTotal -= order.total * (coupon.discount / 100);
    } else if (coupon.type_coupon === 'Amount') {
        discountedTotal -= coupon.discount;
    }


    order.total = discountedTotal;
    await order.save();

    return res.status(200).json({ success: true, message: 'Coupon applied successfully', order });
});


module.exports = {
    createNewOrder,
    updateStatus,
    getUserOder,
    getOders,
    getOrdersCountByDate
}