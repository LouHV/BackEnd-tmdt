const Blog = require('../models/blogModel')
const asyncHandler = require('express-async-handler')
const createBlog = asyncHandler(async (req, res) => {
    const response = await Blog.create(req.body)
    return res.json({
        success: response ? true : false,
        createBlog: response ? response : 'Cannot create new Blog'
    })

})
const getAllBlog = asyncHandler(async (req, res) => {
    const response = await Blog.find().select('title _id')
    return res.json({
        success: response ? true : false,
        blogs: response ? response : 'Cannot get Blog'
    })
})

const updateBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params
    const response = await Blog.findByIdAndUpdate(blogId, req.body, { new: true })
    return res.json({
        success: response ? true : false,
        updatedBlog: response ? response : 'Cannot update Blog'
    })
})

const deleteBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params
    const response = await Blog.findByIdAndDelete(blogId)
    return res.json({
        success: response ? true : false,
        deletedBlog: response ? response : 'Cannot delete Blog'
    })
})
module.exports = {
    createBlog,
    getAllBlog,
    updateBlog,
    deleteBlog
}