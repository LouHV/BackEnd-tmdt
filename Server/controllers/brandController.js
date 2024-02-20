const Brand = require('../models/brandModel')
const asyncHandler = require('express-async-handler')
const createNewBrand = asyncHandler(async (req, res) => {
    const response = await Brand.create(req.body)
    return res.json({
        success: response ? true : false,
        createBrand: response ? response : 'Cannot create new Brand'
    })

})
const getAllBrand = asyncHandler(async (req, res) => {
    const response = await Brand.find().select('title _id')
    return res.json({
        success: response ? true : false,
        Brands: response ? response : 'Cannot get Brand'
    })
})

const updateBrand = asyncHandler(async (req, res) => {
    const { brandId } = req.params
    const response = await Blog.findByIdAndUpdate(brandId, req.body, { new: true })
    return res.json({
        success: response ? true : false,
        updatedBrand: response ? response : 'Cannot update Brand'
    })
})

const deleteBrand = asyncHandler(async (req, res) => {
    const { brandId } = req.params
    const response = await Blog.findByIdAndDelete(brandId)
    return res.json({
        success: response ? true : false,
        deletedBrand: response ? response : 'Cannot delete Brand'
    })
})
module.exports = {
    createNewBrand,
    getAllBrand,
    updateBrand,
    deleteBrand
}