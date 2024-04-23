import React from 'react';

import { apiCreateOrder, createPayment } from "../../apis";

const MoMoPayment = ({ amount, payload, setIsSuccess }) => {

    const {
        products,
        total,
        orderBy,
        address,
        status,
        discountedTotal,
        coupon_code
    } = payload;

    const returnUrl = 'https://shop.com';
    const orderInfo = 'Cửa hàng Shop Lou';
    const orderId = '6626040459d8daa53b394999';

    const handlePayment = async () => {
        try {
            const response = await createPayment({ orderId: orderId, amount: amount, orderInfo: orderInfo, returnUrl: returnUrl })
            if (!response.ok) {
                throw new Error('Failed to create payment');
            }
            const result = response;

            setIsSuccess(true);
            const res = await apiCreateOrder(payload);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <button onClick={handlePayment}>Thanh toán bằng Momo Pay</button>
        </div>
    );
};

export default MoMoPayment;
