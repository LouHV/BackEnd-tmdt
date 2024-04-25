import React from 'react';

import axios from 'axios'
import { apiCreateOrder, createPayment, createPaymentQrCode } from "../../apis";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";



const MoMoPayment = ({ amount, payload, setIsSuccess }) => {

    const navigate = useNavigate()


    const {
        products,
        total,
        orderBy,
        address,
        status,
        discountedTotal,
        coupon_code
    } = payload;

    var date = new Date().getTime();

    const requestId = date + "id";
    const orderId = date + ":0123456778";
    const requestType = 'payWithATM';
    // const notifyUrl = 'https://sangle.free.beeceptor.com';
    // const notifyUrl = 'https://sangle.free.beeceptor.com';
    const notifyUrl = 'http://localhost:3000';
    const returnUrl = 'http://localhost:3000';
    // const amount = amount;
    const orderInfo = "Thanh toán qua ví MoMo";
    const extraData = "ew0KImVtYWlsIjogImh1b25neGRAZ21haWwuY29tIg0KfQ==";

    const handlePayment = async () => {
        try {
            const response = await createPayment({
                requestId,
                orderId,
                requestType,
                notifyUrl,
                returnUrl,
                amount,
                orderInfo,
                extraData
            })
            if (!response) {
                throw new Error('Failed to create payment');
            }

            if (response.success) {
                setIsSuccess(true);
                window.open(`${response.jsonResponse.payUrl}`, "_blank");
            }

            // const res = await apiCreateOrder(payload);
            // setTimeout(() => {
            //     Swal.fire('Congrat!', 'Order was created.', 'success').then(() => {
            //         navigate('/')
            //         window.close()
            //     })
            // }, 1500)

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePaymentQrCode = async () => {
        try {
            const response = await createPaymentQrCode({
                requestId,
                orderId,
                requestType,
                notifyUrl,
                returnUrl,
                amount,
                orderInfo,
                extraData
            })
            if (!response) {
                throw new Error('Failed to create payment');
            }

            if (response.success) {
                setIsSuccess(true);
                console.log("XXXX", response.jsonResponse.payUrl);
                window.open(`${response.jsonResponse.payUrl}`, "_blank");
            }

            // const res = await apiCreateOrder(payload);
            // setTimeout(() => {
            //     Swal.fire('Congrat!', 'Order was created.', 'success').then(() => {
            //         navigate('/')
            //         window.close()
            //     })
            // }, 1500)

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <button onClick={handlePayment}>Thanh toán bằng Momo Credit</button>
            <button onClick={handlePaymentQrCode}>Thanh toán bằng Momo QR Code</button>
        </div>
    );
};

export default MoMoPayment;
