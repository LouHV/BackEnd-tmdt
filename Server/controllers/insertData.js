const Product = require('../models/productModel')
const Category = require("../models/productCategoryModel")
const asyncHandler = require('express-async-handler')
const data = require()
const slugtify = require('slugify')
const categoryData = require('../Data/cate_brand')

const fn = async (product) => {
    await Product.create({
        title: product?.name + Math.round(Math.random() * 1000) + '',
        slug: slugtify(product?.name),
        description: product?.description,
        brand: product?.brand,
        price: Math.round(Number(product?.price).match(/\d/g).john('') / 100),
        category: product?.category[1],
        quantity: Math.round(Math.random() * 1000),
        sold: Math.round(Math.random() * 1000),
        images: product?.images,
        color: product?.variants?.find(el => el.label === 'Color').variants[0]
    })
}
const insertProduct = asyncHandler(async (req, res) => {
    // const response = await Product.create(req.body)
    const promises = []
    for (let product of data) promises.push(fn(product))
    await Promise.all(promises)
    return res.json('Done')

})

const fn2 = async (category) => {
    await ProductCategory.create({
        title: category?.name,
        brand: category?.brand,
    })
}
const insertCategory = asyncHandler(async (req, res) => {
    // const response = await Product.create(req.body)
    const promises = []
    for (let cate of categoryData) promises.push(fn2(cate))
    await Promise.all(promises)
    return res.json('Done')

})
module.exports = { insertProduct,insertCategory }