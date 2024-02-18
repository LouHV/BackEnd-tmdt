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

    //execute query
    // sl sp thoa man dk  khac voi so luong san pham tra ve 1 lan
    queryCommand.then(async (response) => {
        const counts = await Product.find(formatedQueries).countDocuments()
        return res.status(200).json({
            success: response ? true : false,
            products: response ? response : 'Cannot get products',
            counts
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

module.exports = {
    createProduct,
    getProduct,
    getAllProduct,
    updateProduct,
    deleteProduct
}