const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./config/dbConnect")
const routes = require("./routes");
// const cors = require('cors')
const bodyParser = require("body-parser");
dotenv.config()

const app = express()
const port = process.env.PORT || 8088

//doc hhieu dc data client gui len kieu json
app.use(express.json())

app.use(express.urlencoded({extended:true}))

// app.use(cors())
app.use(bodyParser.json());
routes(app);
dbConnect()

app.listen(port, () => {
    console.log("Server is running in port ", + port)
})