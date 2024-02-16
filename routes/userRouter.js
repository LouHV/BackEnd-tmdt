const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { verifyAccessToken } = require('../middlewares/verifyToken')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/getcurrent', verifyAccessToken, userController.getCurrent)


module.exports = router