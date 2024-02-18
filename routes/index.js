const userRouter = require("./userRouter")
const productRouter = require("./productRouter")
const productCategoryRouter = require("./productCategory")
const blogCategoryRouter = require("./blogCategory")


const { notFound, errHandler } = require("../middlewares/errHander")

const routes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/blogCategory', blogCategoryRouter)
    app.use('/api/prodCategory', productCategoryRouter)




    app.use(notFound)
    app.use(errHandler)

}
module.exports = routes;