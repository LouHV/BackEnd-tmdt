const ProductCategory = require('../models/productCategoryModel')
const asyncHandler = require('express-async-handler')
const createCategory = asyncHandler(async (req, res) => {
    const response = await ProductCategory.create(req.body)
    return res.json({
        success: response ? true : false,
        createCategory: response ? response : 'Cannot create new Product-category'
    })

})
const getAllCategory = asyncHandler(async (req, res) => {
    const response = await ProductCategory.find().select('title _id')
    return res.json({
        success: response ? true : false,
        productCategory: response ? response : 'Cannot get Product-category'
    })
})

const updateCategory = asyncHandler(async (req, res) => {
    const { prdcId } = req.params
    const response = await ProductCategory.findByIdAndUpdate(prdcId, req.body, { new: true })
    return res.json({
        success: response ? true : false,
        updatedCategory: response ? response : 'Cannot update Product-category'
    })
})

const deleteCategory = asyncHandler(async (req, res) => {
    const { prdcId } = req.params
    const response = await ProductCategory.findByIdAndDelete(prdcId)
    return res.json({
        success: response ? true : false,
        deletedCategory: response ? response : 'Cannot delete Product-category'
    })
})
module.exports = {
    createCategory,
    getAllCategory,
    updateCategory,
    deleteCategory
}