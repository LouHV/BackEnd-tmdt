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

    const returnUrl = 'http://localhost:3000/';
    const orderInfo = 'Cửa hàng Shop Lou';
    const orderId = '6626040459d8daa53b394999';


    const handlePayment = async () => {
        // try {
        //     const response = await createPayment({ orderId: orderId, amount: amount, orderInfo: orderInfo, returnUrl: returnUrl })
        //     if (!response.ok) {
        //         throw new Error('Failed to create payment');
        //     }
        //     const result = response;

        //     setIsSuccess(true);
        //     const res = await apiCreateOrder(payload);

        // } catch (error) {
        //     console.error('Error:', error);
        // }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                partnerCode: 'MOMOBKUN20180529',
                partnerName: "Test",
                storeId:"MOMOBKUN20180529",
                requestType: "payWithATM",
                ipnUrl : "https://sangle.free.beeceptor.com",
                redirectUrl : "https://sangle.free.beeceptor.com",
                orderId: "1642387834078:0123456778",
                amount:50000,
                orderInfo: orderInfo,
                lang:"vi",
                requestId:"1713890784040id",
                extraData:"ew0KImVtYWlsIjogImh1b25neGRAZ21haWwuY29tIg0KfQ==",
                signature:"19b6bae640dd1ddb7f7dcf95d96d9f1df42930d4d15f49708ba230ce48d7baf5"
            })
            // body: { status: status }
        };

        const response = await fetch(`https://test-payment.momo.vn/v2/gateway/api/create`, requestOptions);
        const result = await response.json();
        console.log('object :>> ', result);
    };

    return (
        <div>
            <button onClick={handlePayment}>Thanh toán bằng Momo Pay</button>
        </div>
    );
};

export default MoMoPayment;
