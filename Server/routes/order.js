const express = require("express");
const router = express.Router();

const OrderController = require("../controllers/orderController")
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloundinary.config')

router.post('/', [verifyAccessToken], OrderController.createNewOrder)
// router.put('/status/:orderId', [verifyAccessToken, isAdmin], OrderController.updateStatus);
router.put('/status/:orderId', [], OrderController.updateStatus);
router.get('/admin', [verifyAccessToken, isAdmin], OrderController.getOders)
router.get('/', [verifyAccessToken], OrderController.getUserOder)

router.post('/apply-coupon', [verifyAccessToken], OrderController.applyCouponToOrder);




module.exports = router