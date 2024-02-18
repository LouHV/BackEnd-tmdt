const express = require("express")
const router = express.Router()
const blogCategoryController = require("../controllers/blogCategoryController")
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], blogCategoryController.createBlog)
router.get('/', blogCategoryController.getAllBlog)
router.put('/:blogId', [verifyAccessToken, isAdmin], blogCategoryController.updateBlog)
router.delete('/:blogId', [verifyAccessToken, isAdmin], blogCategoryController.deleteBlog)

module.exports = router

// CREATE (POST) + PUT - body
// GET + DELETE - query //?asdasd