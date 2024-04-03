const Blog = require('../models/blogModel')
const asyncHandler = require('express-async-handler')

const createNewBlog = asyncHandler(async (req, res) => {
    const { title_blog, description_blog, category } = req.body
    if (!title_blog || !description_blog || !category) throw new Error('missing inputs')
    const response = await Blog.create(req.body)
    return res.json({
        success: response ? true : false,
        createBlog: response ? response : 'Cannot create new Blog'
    })
})

const updateBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await Blog.findByIdAndUpdate(blogId, req.body, { new: true })
    return res.json({
        success: response ? true : false,
        updatedBlog: response ? response : 'Cannot get Blog'
    })
})

const getAllBlog = asyncHandler(async (req, res) => {
    const queries = { ...req.query }
    // tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])
    let queryCommand = Blog.find()
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }

    queryCommand.then(async (response) => {
        
        return res.status(200).json({
            success: response ? true : false,
        blogs: response ? response : 'Cannot update Blog'
        })
    }).catch((err) => {
        throw new Error(err.message)
    })
    // const response = await Blog.find()
    // return res.json({
    //     success: response ? true : false,
    //     blogs: response ? response : 'Cannot update Blog'
    // })
})

/*
khi người dùng like bài viết 1 bài blog thì:
1. check xem trc đó người đó có nhấn dislike không  => bấm like sẽ bỏ dislike, và ngược lại
*/
// const likeBlog = asyncHandler(async (req, res) => {
//     const { _id } = req.user
//     const { blogId } = req.params
//     if (!blogId) throw new Error("Missing inputs")
//     const blog = await Blog.findById(blogId)
//     const allreadyDisliked = blog?.dislikes?.find(el => el.toString() === _id)
//     if (allreadyDisliked) {
//         const response = await Blog.findByIdAndUpdate(blogId, { $pull: { dislikes: _id } }, { new: true })
//         return res.json({
//             success: response ? true : false,
//             result: response
//         })
//     }
//     const isLiked = blog?.likes?.find(el => el.toString() === _id)
//     if (isLiked) {
//         const response = await Blog.findByIdAndUpdate(blogId, { $pull: { likes: _id } }, { new: true })
//         return res.json({
//             success: response ? true : false,
//             result: response
//         })
//     } else {
//         const response = await Blog.findByIdAndUpdate(blogId, { $push: { likes: _id } }, { new: true })
//         return res.json({
//             success: response ? true : false,
//             result: response
//         })
//     }
// })

// const dislikeBlog = asyncHandler(async (req, res) => {
//     const { _id } = req.user
//     const { blogId } = req.params
//     if (!blogId) throw new Error("Missing inputs")
//     const blog = await Blog.findById(blogId)
//     const allreadyLiked = blog?.likes?.find(el => el.toString() === _id)
//     if (allreadyLiked) {
//         const response = await Blog.findByIdAndUpdate(blogId, { $pull: { likes: _id } }, { new: true })
//         return res.json({
//             success: response ? true : false,
//             result: response
//         })
//     }
//     const isDisliked = blog?.dislikes?.find(el => el.toString() === _id)
//     if (isDisliked) {
//         const response = await Blog.findByIdAndUpdate(blogId, { $pull: { dislikes: _id } }, { new: true })
//         return res.json({
//             success: response ? true : false,
//             result: response
//         })
//     } else {
//         const response = await Blog.findByIdAndUpdate(blogId, { $push: { dislikes: _id } }, { new: true })
//         return res.json({
//             success: response ? true : false,
//             result: response
//         })
//     }
// })

//cach2
const toggleLikeDislike = asyncHandler(async (req, res, field) => {
    const { _id } = req.user;
    const { blogId } = req.params;
    if (!blogId) throw new Error("Missing inputs");
    const blog = await Blog.findById(blogId);
    const oppositeField = field === 'likes' ? 'dislikes' : 'likes';
    const alreadyExistsInOpposite = blog[oppositeField]?.find(el => el.toString() === _id);
    const alreadyExistsInDesired = blog[field]?.find(el => el.toString() === _id);
    let updateOperation = {};

    // If the user has already liked or disliked, remove it first
    if (alreadyExistsInOpposite) {
        updateOperation = { $pull: { [oppositeField]: _id } };
    }

    // If the user has already liked or disliked in the desired field, remove it
    if (alreadyExistsInDesired) {
        updateOperation = { ...updateOperation, $pull: { [field]: _id } };
    } else {
        // Then, add the user's ID to the desired array if it was not already there
        updateOperation = { ...updateOperation, $addToSet: { [field]: _id } };
    }

    const response = await Blog.findByIdAndUpdate(blogId, updateOperation, { new: true });
    return res.json({
        success: response ? true : false,
        result: response
    });
});
const likeBlog = asyncHandler(async (req, res) => {
    return toggleLikeDislike(req, res, 'likes');
});

const dislikeBlog = asyncHandler(async (req, res) => {
    return toggleLikeDislike(req, res, 'dislikes');
});
const excludedFields = 'firstname lastname'
const getBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params
    const blog = await Blog.findByIdAndUpdate(blogId, { $inc: { numberViews: 1 } }, { new: true })
        .populate('likes', excludedFields)
        .populate('dislikes', excludedFields) // lay thong tin nguoi like
    return res.json({
        success: blog ? true : false,
        blog
    })
})

const deleteBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params
    const blog = await Blog.findByIdAndDelete(blogId)
    return res.json({
        success: blog ? true : false,
        result: blo || 'Something went wrong'
    })
})

const uploadImagesBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params
    if (!req.file) throw new Error("Missing inputs")
    const response = await Blog.findByIdAndUpdate(blogId, { image_blog: req.file.path }, { new: true })
    return res.status(200).json({
        status: response ? true : false,
        updatedBlog: response ? response : 'Cannot update images product'
    })
})

module.exports = {
    createNewBlog,
    updateBlog,
    getAllBlog,
    likeBlog,
    dislikeBlog,
    getBlog,
    deleteBlog,
    uploadImagesBlog
}