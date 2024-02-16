const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body

    // kiem tra co la @gmail.com khong
    const reg = /^(.+)@(\S+)$/
    const isCheckEmail = reg.test(email)
    if (!email || !password || !firstname || !lastname || !mobile) {
        return res.status(400).json({
            success: false,
            message: 'Input is required',
        })
    }
    else if (!isCheckEmail) {
        return res.status(400).json({
            success: false,
            message: 'Input is Email',
        })
    }
    const response = await User.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        data: response
    })
})

module.exports = { 
    register, 
}