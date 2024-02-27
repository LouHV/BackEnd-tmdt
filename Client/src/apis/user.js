import axios from "../axios";

export const apiRegister = (data)=>axios({
    url:'/user/register',
    method:'POST',
    data
})

export const apiLogin = (data)=>axios({
    url:'/user/login',
    method:'POST',
    data
})
export const apiForgotPassword = (data)=>axios({
    url:'/user/forgotpassword',
    method:'POST',
    data
})
export const apiResetPassword = (data)=>axios({
    url:'/user/resetpassword',
    method:'PUT',
    data
})