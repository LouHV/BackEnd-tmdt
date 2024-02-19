const express = require("express")
const router = express.Router()
const productController = require("../controllers/productController")
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloundinary.config')

router.post('/', [verifyAccessToken, isAdmin], productController.createProduct)
router.get('/', productController.getAllProduct)
router.put('/ratings', verifyAccessToken, productController.ratings)

router.post('/uploadimage/:prdId', [verifyAccessToken, isAdmin], uploader.single('images'), productController.uploadImagesPrd)
router.put('/:prdId', [verifyAccessToken, isAdmin], productController.updateProduct)
router.delete('/:prdId', [verifyAccessToken, isAdmin], productController.deleteProduct)
router.get('/:prdId', productController.getProduct)


module.exports = router

// CREATE (POST) + PUT - body
// GET + DELETE - query //?asdasd