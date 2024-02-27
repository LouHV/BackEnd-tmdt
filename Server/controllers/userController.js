const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const { generateAccessToken, generateRefreshToken } = require("../middlewares/jwt")
const jwt = require('jsonwebtoken')
const sendMail = require("../ultils/sendMail")
const crypto = require('crypto')

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
        const { password, role, refreshToken, ...userData } = response.toObject()

        // Tạo accessToken
        const accessToken = generateAccessToken(response._id, role)

        // Tạo refreshToken
        const newRefreshToken = generateRefreshToken(response._id)

        //Lưu refresh token vào database
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })

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
    const rs = jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
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
        success: true,
        message: 'Logout is done'
    })
})
//client gui email dk => server check co hop le k => gui mail, kem link(password change token)
//client check mail => click vaof link
// client gui api kem token 
//check token co giong voi token cua server gui mail khong

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) throw new Error('missing email')
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')
    const resetToken = user.createPasswordChangedToken()
    await user.save()
    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. 
    <a href=${process.env.CLIENT_URL}reset-password/${resetToken}>Click here</a>`
    const data = {
        email,
        html
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: rs.response?.includes('OK') ? true : false,
        message: rs.response?.includes('OK') ? 'Hãy check mail của bạn.' : 'Đã có lỗi, hãy thử lại sau.'
    })
})
const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Missing inputs')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangedAt = Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        message: user ? 'Updated password' : 'Something went wrong'

    })
})
const getUsers = asyncHandler(async (req, res) => {
    const user = await User.find().select('-refreshToken -password -role')
    return res.status(200).json({
        success: user ? true : false,
        user: user ? user : 'User not found'
    })
})

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!id || Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select("-password -role -refreshToken")
    return res.status(200).json({
        success: user ? true : false,
        updateUser: response ? response : "Some thing went wrong"
    })
})

const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select("-password -role -refreshToken")
    return res.status(200).json({
        success: user ? true : false,
        updateUser: response ? response : "Some thing went wrong"
    })
})

const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.query
    if (!id) throw new Error('Missing inputs')
    const response = await User.findByIdAndDelete(_id)
    return res.status(200).json({
        success: user ? true : false,
        deleteUser: response ? `User with email ${response.email} deleted` : "No user delete"
    })
})

const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!req.body.address) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, { $push: { address: req.body.address } }, { new: true }).select("-password -role -refreshToken")
    return res.status(200).json({
        success: user ? true : false,
        updateUser: response ? response : "Some thing went wrong"
    })
})

const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { prdId, quantity, color } = req.body

    if (!prdId || !quantity || !color) throw new Error('Missing inputs')
    const user = await User.findById(_id).select('cart')
    const alreadyPrd = user?.cart?.find(el => el.product.toString() === prdId)
    console.log('alreadyPrd :>> ', alreadyPrd);
    if (alreadyPrd) {
        if (alreadyPrd.color === color) {
            const response = await User.updateOne({ cart: { $elemMatch: alreadyPrd } }, { $set: { "cart.$.quantity": quantity } }, { new: true })
            return res.status(200).json({
                success: response ? true : false,
                updatedCart: response ? response : "Some thing went wrong"
            })
        } else {
            const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: prdId, quantity, color } } }, { new: true })
            return res.status(200).json({
                success: response ? true : false,
                updatedCart: response ? response : "Some thing went wrong"
            })
        }
    }
    else {
        const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: prdId, quantity, color } } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            updatedCart: response ? response : "Some thing went wrong"
        })
    }
})

module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAddress,
    updateCart
}