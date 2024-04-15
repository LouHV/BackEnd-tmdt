const express = require("express");
const router = express.Router();

const CartController = require("../controllers/cartController")
const { verifyAccessToken } = require('../middlewares/verifyToken')
const uploader = require('../config/cloundinary.config')

router.post('/', [verifyAccessToken], CartController.addProductToCart)
router.get('/', [verifyAccessToken], CartController.getCart)
router.put('/quantity', [verifyAccessToken], CartController.updateCartQuantity);
router.delete('/', [verifyAccessToken], CartController.deleteCart);

module.exports = router;
