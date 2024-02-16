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

    // kiem tra neu ton tai email tra ra loi
    const user = await User.findOne({ email })
    if (user)
        throw new Error("User has existed!")
    else {
        const newUser = await User.create(req.body)
        return res.status(200).json({
            success: newUser ? true : false,
            data: newUser,
            message: newUser ? 'Register is successfully' : 'Something went wrong'
        })
    }
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // kiem tra co la @gmail.com khong
    const reg = /^(.+)@(\S+)$/
    const isCheckEmail = reg.test(email)
    if (!email || !password) {
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

    // logic dang nhap
    // plain object
    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        const { password, role, ...userData } = response.toObject()
        return res.status(200).json({
            success: true,
            userData
        })
    } else {
        throw new Error('Invalid crendentials!')
    }
})

module.exports = {
    register,
    login,
}