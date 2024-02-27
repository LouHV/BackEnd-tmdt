const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/getcurrent', verifyAccessToken, userController.getCurrent)
router.post('/refreshtoken', userController.refreshAccessToken)
router.get('/logout', userController.logout)
router.post('/forgotpassword', userController.forgotPassword)
router.put('/resetpassword', userController.resetPassword)
router.get('/', [verifyAccessToken, isAdmin], userController.getUsers)
router.delete('/', [verifyAccessToken, isAdmin], userController.deleteUser)
router.put('/current', [verifyAccessToken], userController.updateUser)
router.put('/cart', [verifyAccessToken], userController.updateCart)
router.put('/address', [verifyAccessToken, isAdmin], userController.updateUserAddress)
router.put('/:uid', [verifyAccessToken, isAdmin], userController.updateUserByAdmin)

module.exports = router

// CREATE (POST) + PUT - body
// GET + DELETE - query //?asdasd