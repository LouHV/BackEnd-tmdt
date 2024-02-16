const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const { generateAccessToken, generateRefreshToken } = require("../middlewares/jwt")
const jwt = require('jsonwebtoken')

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
    const { _id } = req.user

    // kiem tra neu ton tai email tra ra loi
    const user = await User.findById({ _id }).select('-refreshToken -password -role')
    return res.status(200).json({
        success: false,
        rs: user ? user : 'User not found'
    })
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    //lấy token từ cookies
    const cookie = req.cookies
    // Check xem có token hay không
    if (!cookie && !cookie.refreshToken) throw Error('No refresh token in cookies')
    //check token có hợp lệ hay không
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token not matched'
    })
})

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    //xoá refresh token ở db
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    // xoá refresh token ở cookie trình duyệt
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success:true,
        message:'Logout is done'
    })
})

module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout
}