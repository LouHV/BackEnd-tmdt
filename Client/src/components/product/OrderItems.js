import React, { useCallback, useState } from 'react'
import SelectQuantity from '../common/SelectQuantity'
import { formatMoney, formatPrice } from '../../ultils/helper'
import { apiDeleteCart } from '../../apis';
import { toast } from 'react-toastify';
import { getCurrent } from '../../store/user/asyncActions';
import withBase from '../../hocs/withBase';

const OrderItems = ({ el, dispatch, navigate }) => {
    console.log('el :>> ', el);
    const [quantity, setquantity] = useState(1)
    const handleQuantity = useCallback((number) => {

        if (!Number(number) || Number(number) < 1) {
            return
        } else {
            setquantity(number)
        }
    }, [quantity])

    const handleChangeQuantity = useCallback((flag) => {
        if (flag === 'minus' && quantity === 1) return
        if (flag === 'minus') setquantity(prev => +prev - 1)
        if (flag === 'plus') setquantity(prev => +prev + 1)
    }, [quantity])
    const handelClickDelete = async (cartId) => {
        const response = await apiDeleteCart(cartId)
        if (response.success) {
            dispatch(getCurrent())
            toast.success(response.message)
        } else toast.error(response.message)
    }

    return (
        <div className='w-main mx-auto grid my-8 p-3 border grid-cols-10 '>
            <span className='col-span-5  w-full text-center cursor-pointer'>
                <div className='flex gap-2'
                    onClick={e => navigate(`/${el.product?.category}/${el.product?._id}/${el.product?.title}`)}>
                    <img src={el.product?.thumb} alt='thumb' className='w-[80px] h-[80px] object-cover' />
                    <div className='flex flex-col gap-1'>
                        <span className='text-sm text-main'>{el.product?.title}</span>
                        <span className='text-[10px]'>{el.color}</span>
                        {/* <span className='text-sm'>{formatMoney(el.product?.price) + ' VND'}</span> */}
                    </div>
                </div>
            </span>
            <div className="text-sm flex justify-center">
                <div className="flex items-center">
                    <SelectQuantity
                        fullWidth={true}
                        quantity={el?.quantity}
                        handleQuantity={handleQuantity}
                        handleChangeQuantity={handleChangeQuantity}
                    />
                </div>


            </div>
            <span className='col-span-3 w-full text-center'>
                <span className='flex w-full h-full items-center justify-center text-orange-500'>
                    {`${formatMoney(formatPrice(el?.price))} VND`}
                </span>
            </span>
            <span className='col-span-1 w-full text-center'>
                <div
                    onClick={() => handelClickDelete(el?._id)}
                    className='flex w-full h-full items-center justify-center hover:text-main hover:underline cursor-pointer'>
                    Delete
                </div>
            </span>
        </div>
    )
}

export default withBase(OrderItems)