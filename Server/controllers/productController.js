const { query, response } = require("express")
const Product = require("../models/productModel")
const asyncHandler = require("express-async-handler")
const slugtify = require('slugify')

const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error("Missing inputs")
    console.log(1)
    if (req.body && req.body.title) req.body.slug = slugtify(req.body.title)
    console.log(req.body.slug)
    const newProduct = await Product.create(req.body)
    console.log(3)
    return res.status(200).json({
        success: newProduct ? true : false,
        createProduct: newProduct ? newProduct : 'Cannot create new product'
    })
})

const getProduct = asyncHandler(async (req, res) => {
    const { prdId } = req.params
    const product = await Product.findById(prdId)
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get product'
    })
})
// filtering, sorting & pagination
const getAllProduct = asyncHandler(async (req, res) => {
    const queries = { ...req.query }
    // tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])

    //format operators cho đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`)
    const formatedQueries = JSON.parse(queryString)

    //filltering
    if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' }
    let queryCommand = Product.find(formatedQueries)

    //sorting
    // acb,efg [abc,efg] => abc efg
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }
    //Filed limiting
    if (req.query.fields) {

        const fields = req.query.fields.split(',').join(' ')

        queryCommand = queryCommand.select(fields)
    }
    //Pagination
    //limit la so object lay ve trong 1 api
    //skip: 
    const page = +req.query.page || 1 // Dau + se chuyen STRING sang number
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)

    //execute query
    // sl sp thoa man dk  khac voi so luong san pham tra ve 1 lan
    queryCommand.then(async (response) => {
        const counts = await Product.find(formatedQueries).countDocuments()
        return res.status(200).json({
            success: response ? true : false,
            counts,
            products: response ? response : 'Cannot get products',

        })
    }).catch((err) => {
        throw new Error(err.message)
    })

})

const updateProduct = asyncHandler(async (req, res) => {
    const { prdId } = req.params
    if (req.body && req.body.title) req.body.slug = slugtify(req.body.title)
    const updatedProduct = await Product.findByIdAndUpdate(prdId, req.body, { new: true })
    return res.status(200).json({
        success: updatedProduct ? true : false,
        productData: updatedProduct ? updatedProduct : 'Cannot update product'
    })
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { prdId } = req.params
    const deletedProduct = await Product.findByIdAndDelete(prdId)
    return res.status(200).json({
        success: deletedProduct ? true : false,
        productData: deletedProduct ? deletedProduct : 'Cannot delete product'
    })
})

const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { star, comment, prdId } = req.body

    const ratingProduct = await Product.findById(prdId)
    const alreadyRating = ratingProduct?.rating?.find(el => el.postedBy.toString() === _id)
    console.log('allreadyRating :>> ', { alreadyRating });
    if (alreadyRating) {
        await Product.updateOne({
            rating: { $elemMatch: alreadyRating }
        }, {
            $set: { "rating.$.star": star, "rating.$.comment": comment }
        }, { new: true })

    } else {
        // add star & comment
        await Product.findByIdAndUpdate(
            prdId, {
            $push: { rating: { star, comment, postedBy: _id } }
        }, { new: true })
    }

    //sum rating
    const updatedProduct = await Product.findById(prdId)
    const ratingCount = updatedProduct.rating.length
    const sumRating = updatedProduct.rating.reduce((sum, el) => sum + +el.star, 0)
    updatedProduct.totalRating = Math.round(sumRating * 10 / ratingCount) / 10
    await updatedProduct.save()

    return res.status(200).json({
        status: true,
        updatedProduct
    })
})

const uploadImagesPrd = asyncHandler(async (req, res) => {
    const { prdId } = req.params
    if (!req.files) throw new Error("Missing inputs")
    const response = await Product.findByIdAndUpdate(prdId, { $push: { images: { $each: req.files.map(el => el.path) } } }, { new: true })
    return res.status(200).json({
        status: response ? true : false,
        updatedProduct: response ? response : 'Cannot update images product'
    })
})
module.exports = {
    createProduct,
    getProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImagesPrd
}