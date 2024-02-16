const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { verifyAccessToken } = require('../middlewares/verifyToken')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/getcurrent', verifyAccessToken, userController.getCurrent)
router.post('/refreshtoken', userController.refreshAccessToken)
router.get('/logout', userController.logout)
router.get('/forgotpassword', userController.forgotPassword)
router.get('/resetpassword', userController.resetPassword)  




module.exports = router

// CREATE (POST) + PUT - body
// GET + DELETE - query //?asdasd