import React, { useState, useCallback } from "react";
import { InputField, Button } from "../../components";
import { Link } from "react-router-dom";
import path from "../../ultils/path";
import { apiLogin, apiForgotPassword } from "../../apis/user";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import { register } from "../../store/user/userSlice";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify'

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [payload, setPayload] = useState({
        email: '',
        password: '',
    })

    const [isForgotPassword, setisForgotPassword] = useState(false)

    const [email, setemail] = useState('')
    const handleForgotPassword = async () => {
        const response = await apiForgotPassword({ email })
        if (response.success) {
            toast.info(response.message, { theme: 'colored' })
        } else toast.info(response.message, { theme: 'colored' })
    }

    const handleSubmit = useCallback(async () => {
        const { email, password } = payload
        const response = await apiLogin(payload)
        Swal.fire(response.success ? 'Congratulation' : 'Oops!', response.message, response.success ? 'Success' : 'Error')
            .then((result) => { // Nhận kết quả từ swal
                if (result.isConfirmed && response.success) { // Nếu xác nhận và thành công
                    console.log('result :>> ', result);
                    dispatch(register({ isLoggedIn: true, token: response.accessToken, userData: response.userData }))
                    navigate(`/${path.HOME}`); // Điều hướng sang trang login
                }
            })

    }, [payload])

    return (
        <div className="w-screen h-screen relative">
            {isForgotPassword && <div className="absolute top-0 left-0 bottom-0 right-0 flex-col bg-white flex items-center py-8 z-50">
                <div className="flex flex-col gap-4">
                    <label htmlFor="email">Enter your email</label>
                    <div className="flex items-center justify-center mt-2 w-full gap-2">
                        <input type="text" id="email"
                            className="2-[800px] pb-2 border-b  placeholder:text-sm p-1 mr-2"
                            placeholder="Exp: email@gmail.com"
                            value={email}
                            onChange={e => setemail(e.target.value)}
                        />
                        <Button
                            nameButton='Submit'
                            handleOnClick={handleForgotPassword}
                            style='px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2'
                        />
                        <Button
                            nameButton='Back'
                            handleOnClick={() => { setisForgotPassword(false) }} />
                    </div>
                </div>
            </div>}
            <img
                src="https://img.pikbest.com/backgrounds/20220119/e-commerce-carnival-shopping-colorful-gradient-e-commerce-event-poster-background_6243918.jpg!bw700"
                alt=""
                className="w-full h-full object-cover-fill"
            />
            <div className="absolute top-0 bottom-0 left-1/2 right-1/2 items-center justify-center flex">
                <div className="p-8 bg-white rounded-md flex flex-col items-center min-w-[500px] absolute ">
                    <h1 className="text-[28px] font-semibold text-main mb-8">Login</h1>


                    <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey='email' />
                    <InputField
                        value={payload.password}
                        setValue={setPayload}
                        nameKey='password'
                        type='password' />

                    <Button
                        nameButton='Login'
                        handleOnClick={handleSubmit}
                        fw
                    />

                    <div className="flex items-center justify-between my-2 w-full text-sm">
                        <span className="text-main hover:underline cursor-pointer"
                            onClick={() => { setisForgotPassword(true) }}
                        >Forgot your account?</span>
                        <Link
                            className="text-main hover:underline cursor-pointer"
                            to={`/${path.REGISTER}`}
                        >Create new account</Link>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default Login