const UserRouter = require("./userRouter")
const {notFound,errHandler} = require("../middlewares/errHander")

const routes = (app) => {
    app.use('/api/user',UserRouter)
    // app.use('/api/product',ProductRouter)


    app.use(notFound)
    app.use(errHandler)

}
module.exports = routes;