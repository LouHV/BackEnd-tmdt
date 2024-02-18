const express = require("express")
const router = express.Router()
const blogController = require("../controllers/blogController")
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.get('/', blogController.getAllBlog)
router.post('/', [verifyAccessToken, isAdmin], blogController.createNewBlog)
router.get('/one/:blogId', blogController.getBlog)
router.put('/likes/:blogId', [verifyAccessToken], blogController.likeBlog)
router.put('/dislike/:blogId', [verifyAccessToken], blogController.dislikeBlog)
router.put('/:blogId', [verifyAccessToken, isAdmin], blogController.updateBlog)
router.delete('/:blogId', [verifyAccessToken, isAdmin], blogController.deleteBlog)


module.exports = router