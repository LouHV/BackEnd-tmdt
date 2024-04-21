import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { formatMoney, formatPrice } from '../../ultils/helper'
import { Button, Cash, Congrat, InputForm, Paypal } from '../../components'
import { useForm } from 'react-hook-form'
import withBase from '../../hocs/withBase'
import { getCurrent } from '../../store/user/asyncActions'
import { apiGetCouponByName } from '../../apis'
import { toast } from 'react-toastify'
import { IoIosArrowRoundBack } from "react-icons/io";
import path from '../../ultils/path'

const Checkout = ({ dispatch, navigate }) => {
    const { register, formState: { errors }, watch, setValue, reset, handleSubmit } = useForm()
    const address = watch('address')

    const { current } = useSelector(state => state.user)

    const { cart } = useSelector(state => state.cart);
    

    const totalOrder = Math.round(current?.cart?.reduce((sum, el) => +el.price + sum, 0) / 24761)

    const [paymentMethod, setPaymentMethod] = useState('');

    const [isSuccess, setIsSuccess] = useState(false)

    const [haveCoupon, setHaveCoupon] = useState('')

    useEffect(() => {
        setValue('address', current?.address)
    }, [current.address])
    useEffect(() => {
        if (isSuccess) {
            dispatch(getCurrent())
        }

    }, [isSuccess, paymentMethod])
    const handleGetCouponByName = async (data) => {

        const response = await apiGetCouponByName(data)
        console.log('response :>> ', response.coupon);
        const expiryDate = new Date(response?.coupon?.expiry);
        const expiryTime = expiryDate.getTime();
        const startDate = new Date(response?.coupon?.start_date)
        const startTime = startDate.getTime();

        if (response.success) {
            if (Date.now() <= expiryTime && Date.now() >= startTime) {
                setHaveCoupon(response.coupon.discount)
                reset()
            }
            else {
                toast.error('Mã giảm giá nằm ngoài hạn sử dụng.')
            }
        } else {
            setHaveCoupon(1)
            toast.error(response.message)
        }

    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPaymentMethod({ [name]: value });

    };
    console.log('paymentMethod :>> ', paymentMethod);
    return (
        <div className='w-full'>
            <div className='flex justify-start items-center text-xl m-8 hover:text-main cursor-pointer w-[85px] h-auto '
                onClick={() => navigate(`/${path.DETAIL_CART}`)}
            ><IoIosArrowRoundBack size={25} />Back</div>
            <div className='w-main mx-auto flex flex-col items-center justify-center py-8'>
                {isSuccess && <Congrat />}
                <div className='flex w-full flex-col items-center '>
                    <h2 className='text-2xl font-bold'>Checkout your order</h2>
                    <table className='table-auto w-full'>
                        <thead>
                            <tr className='border bg-gray-200'>
                                <th className='p-2 text-left'>Product</th>
                                <th className='text-center p-2'>Quantity</th>
                                <th className='text-right p-2'>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart?.cart_products?.map(el => (<tr className='border w-full ' key={el._id}>
                                <td className='p-2 text-left '>{el?.title}</td>
                                <td className='p-2 text-center'>{el.quantity}</td>
                                <td className='p-2 text-right'>{`${formatMoney(el.price)} VND`}</td>
                            </tr>))}
                        </tbody>
                    </table>
                </div>

                <div className='w-full mt-5'>
                    <InputForm
                        label='Your address'
                        register={register}
                        errors={errors}
                        id='address'
                        validate={{
                            required: 'Need fill this field'
                        }}
                        placeholder='Please fill the address first'
                        style='text-sm font-medium' />

                </div>
                <div className='w-full flex'>
                    <form onSubmit={handleSubmit(handleGetCouponByName)}>

                        <InputForm
                            label='Coupon'
                            register={register}
                            errors={errors}
                            id='name_coupon'
                            validate={{
                                required: null
                            }}
                            fullWidth
                            placeholder='Name of new coupon'
                        />
                        <Button type='submit'>Appy</Button>
                    </form>
                </div>

                <div className='w-main mx-auto flex flex-col mb-12 justify-center items-end gap-3'>
                    <span className='flex items-center gap-4 text-xl'>
                        <span className='font-medium'>{`Subtotal (${cart?.cart_products?.length || 0} items): `}</span>
                        <span className='text-main'>{!haveCoupon ? `${formatMoney(formatPrice(cart?.cart_products?.reduce((sum, el) => (+el.price + sum), 0)))} ${haveCoupon} VND` : `${formatMoney(formatPrice(current?.cart?.reduce((sum, el) => (+el.price + sum) * haveCoupon, 0)))} ${haveCoupon} VND`}</span>

                    </span>
                </div>
                <div className='w-main mx-auto flex flex-col mb-12 justify-center items-end gap-3'>
                    <label htmlFor="paymentMethod" className='mt-1'>Select a payment method:</label>
                    <select className='rounded border border-gray-300' name="paymentMethod" onChange={handleInputChange}>
                        <option value="">Cash</option>
                        <option value="paypal">Paypal</option>
                        <option value="momo">Momo</option>
                    </select>
                </div>

                {paymentMethod.paymentMethod === "" && <div className='w-full justify-center'>
                    <Cash
                        payload={{
                            products: cart?.cart_products,
                            total: Math.round(cart?.cart_products?.reduce((sum, el) => +el.price + sum, 0) ),
                            orderBy: current?._id,
                            address: current?.address,
                            status: 1
                        }}
                        setIsSuccess={setIsSuccess}
                        />
                </div>}
                {paymentMethod.paymentMethod === "paypal" && <div className='w-full justify-center'>
                    <Paypal
                        payload={{
                            products:cart?.cart_products,
                            total: Math.round(cart?.cart_products?.reduce((sum, el) => +el.price + sum, 0) / 24761),
                            orderBy: current?._id,
                            address: current?.address,
                            status: 2
                            
                        }}
                        setIsSuccess={setIsSuccess}
                        amount={Math.round(cart?.cart_products?.reduce((sum, el) => +el.price + sum, 0) / 24761)} />
                </div>}
            </div>
        </div>

    )
}

export default withBase(Checkout)