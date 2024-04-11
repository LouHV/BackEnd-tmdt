const userRouter = require("./userRouter")
const productRouter = require("./productRouter")
const productCategoryRouter = require("./productCategory")
const brandCategoryRouter = require("./brand")
const blogRouter = require("./blog")
const brand = require("./brand")
const coupon = require("./coupon")
const order = require("./order")
const insert = require("./insert")

const { notFound, errHandler } = require("../middlewares/errHander")

const routes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/brandCategory', brandCategoryRouter)
    app.use('/api/prodCategory', productCategoryRouter)
    app.use('/api/blog', blogRouter)
    app.use('/api/brand', brand)
    app.use('/api/coupon', coupon)
    app.use('/api/order', order)
    app.use('/api/insert', insert)


    app.use(notFound)
    app.use(errHandler)

}
module.exports = routes;