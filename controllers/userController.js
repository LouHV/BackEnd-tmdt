const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const { generateAccessToken, generateRefreshToken } = require("../middlewares/jwt")

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

// refresh token => cấp mới access token
// accessToken => xác thực người dùng, phân quyền người dùng
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
        // Tách password và role ra khỏi response
        const { password, role, ...userData } = response.toObject()

        // Tạo accessToken
        const accessToken = generateAccessToken(response._id, role)

        // Tạo refreshToken
        const refreshToken = generateRefreshToken(response._id)

        //Lưu refresh token vào database
        await User.findByIdAndUpdate(response._id, { refreshToken }, { new: true })

        //Lưu refreshToken vào cookie
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 365 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            accessToken,
            refreshToken,
            userData
        })
    } else {
        throw new Error('Invalid crendentials!')
    }
})

const getCurrent = asyncHandler(async (req, res) => {
    const { _id} = req.user
    
    // kiem tra neu ton tai email tra ra loi
    const user = await User.findById({ _id }).select('-refreshToken -password -role')
   return res.status(200).json({
    success: false,
    rs: user ? user : 'User not found'
   })
})

module.exports = {
    register,
    login,
    getCurrent,
}