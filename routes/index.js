const userRouter = require("./userRouter")
const productRouter = require("./productRouter")
const {notFound,errHandler} = require("../middlewares/errHander")

const routes = (app) => {
    app.use('/api/user',userRouter)
    app.use('/api/product',productRouter)


    app.use(notFound)
    app.use(errHandler)

}
module.exports = routes;