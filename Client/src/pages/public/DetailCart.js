import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { Breadcrumbs, Button, SelectQuantity } from '../../components'
import withBase from '../../hocs/withBase'
import { formatMoney, formatPrice } from '../../ultils/helper'
import { Navigate } from 'react-router-dom'
import path from '../../ultils/path'
import OrderItems from '../../components/product/OrderItems'
import emptyCart from '../../assets/cart-empty.png'

const DetailCart = ({ navigate }) => {
    const { isLoggedIn, current } = useSelector(state => state.user)
    const handleCheckout = () => {
        navigate('/checkout')
    }
    if (!isLoggedIn) return <Navigate to={`/${path.LOGIN}`} replace={true} />
    return (
        <div className='w-full'>
            <div className='h-[81px] flex justify-center items-center bg-gray-100'>
                <div className="w-main">
                    <h3 className='font-semibold uppercase'>My  Cart</h3>
                    <Breadcrumbs />
                </div>
            </div>
            {current?.cart?.length > 0 && <div>
                <div className='w-main mx-auto font-bold grid my-8 py-3 border grid-cols-10'>
                    <span className='col-span-5 w-full text-center'>
                        Product
                    </span>
                    <span className='col-span-1 w-full text-center'>
                        Quantity
                    </span>
                    <span className='col-span-3 w-full text-center'>
                        Total
                    </span>
                    <span className='col-span-1 w-full text-center'>
                        Action
                    </span>
                </div>
                {current?.cart?.map(el => (
                    <OrderItems el={el} key={el.id} />
                ))}

                <div className='w-main mx-auto flex flex-col mb-12 justify-center items-end gap-3'>
                    <span className='flex items-center gap-4 text-xl'>
                        <span>{`Subtotal (${current?.cart?.length || 0} items): `}</span>
                        <span className='text-main'>{`${formatMoney(formatPrice(current?.cart?.reduce((sum, el) => +el.price + sum, 0)))} VND`}</span>
                        <Button
                            handleOnClick={handleCheckout}
                        >Check out</Button>
                    </span>
                </div>
            </div>}

            {current?.cart?.length <= 0 && <div className='min-h-[450px] flex  justify-center items-center flex-col gap-2'>
                <img src={emptyCart} alt='logo' className='w-[98px] h-[108px] object-contain rounded-full' />
                <span className='text-gray-400 text-xl'>Your shopping cart is empty!</span>
                <Button
                    handleOnClick={() => navigate(`/${path.PRODUCTS}`)}
                >BUY NOW</Button>
            </div>}
        </div>

    )
}

export default withBase(DetailCart)