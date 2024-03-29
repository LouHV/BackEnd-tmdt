const Order = require('../models/oderModel')
const User = require("../models/userModel")
const Coupon = require("../models/couponModel")
const Product = require("../models/productModel")

const asyncHandler = require('express-async-handler')


const createNewOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    // const { coupon } = req.body
    // const userCart = await User.findById(_id).select('cart').populate('cart.product', 'title price')
    // const products = userCart?.cart?.map(el => ({
    //     product: el.product._id,
    //     count: el.quantity,
    //     color: el.color
    // }))
    // let total = userCart?.cart?.reduce((sum, el) => el.product.price * el.quantity + sum, 0)
    // const createData = { products, total, oderBy: _id }
    // if (coupon) {
    //     const selectedCoupon = await Coupon.findById(coupon)
    //     total = Math.round(total * (1 - +selectedCoupon?.disscount / 100) / 1000) * 1000 || total
    //     createData.total = total
    //     createData.coupon = coupon
    // }
    // const rs = await Order.create(createData)
    // return res.json({
    //     success: rs ? true : false,
    //     createdOrder: rs ? rs : 'Cannot create new Order',
    //     userCart
    // })
    const { products, total, address, status } = req.body
    if (address) {
        await User.findByIdAndUpdate(_id, { address, cart: [] })
    }
    const data = { products, total, orderBy: _id }
    if (status) data.status = status
    const rs = await Order.create(data)
    const orderedProducts = rs.products;
    console.log('orderedProducts :>> ', orderedProducts);
    for (const product of orderedProducts) {
        // Truy cập vào bảng Product để lấy thông tin sản phẩm
        const productInfo = await Product.findById(product.product);
        console.log('productInfo :>> ', productInfo);
        // Trừ đi số lượng đã đặt hàng từ quantity hiện tại
        const newQuantity = productInfo.quantity - product.quantity;

        // Tăng sold lên
        const newSold = +productInfo.sold + +product.quantity;

        // Cập nhật thông tin sản phẩm trong bảng Product
        await Product.findByIdAndUpdate(product.product, {
            quantity: newQuantity,
            sold: newSold
        });
    }
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
        userCart
    })
})

// const getUserOder = asyncHandler(async (req, res) => {
//     const { _id } = req.user
//     const response = await Order.find({ oderBy: _id })
//     return res.json({
//         success: response ? true : false,
//         createdOrder: response ? response : 'Something went wrong',
//         userCart
//     })
// })


const getUserOder = asyncHandler(async (req, res) => {
    let queryCommand = Order.find();
    const queries = { ...req.query };
    const { _id } = req.user
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(el => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`);
    const formattedQueries = JSON.parse(queryString);

    // if (queries?.name) {
    //     formattedQueries.name = { $regex: queries.name, $options: 'i' };
    // }

    // if (req.query.q) {
    //     delete formattedQueries.q
    //     formattedQueries['$or'] = [
    //         { firstname: { $regex: req.query.q, $options: 'i' } },
    //         { lastname: { $regex: req.query.q, $options: 'i' } },
    //         { email: { $regex: req.query.q, $options: 'i' } }

    //     ]
    // }
    // console.log('formattedQueries :>> ', formattedQueries);
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

    // if (queries?.name) {
    //     formattedQueries.name = { $regex: queries.name, $options: 'i' };
    // }

    // if (req.query.q) {
    //     delete formattedQueries.q
    //     formattedQueries['$or'] = [
    //         { firstname: { $regex: req.query.q, $options: 'i' } },
    //         { lastname: { $regex: req.query.q, $options: 'i' } },
    //         { email: { $regex: req.query.q, $options: 'i' } }

    //     ]
    // }
    // console.log('formattedQueries :>> ', formattedQueries);
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
module.exports = {
    createNewOrder,
    updateStatus,
    getUserOder,
    getOders,
    getOrdersCountByDate
}