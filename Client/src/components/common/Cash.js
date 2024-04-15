import React from 'react'
import { apiCreateOrder } from '../../apis';
import Swal from "sweetalert2";
import withBase from '../../hocs/withBase';
import Button from '../buttons/Button';

const Cash = ({ navigate, amount, payload, setIsSuccess }) => {
    const handleSaveOrder = async () => {

        const response = await apiCreateOrder(payload)
        console.log('response :>> ', payload);
        if (response.success) {
            setIsSuccess(true)
            setTimeout(() => {
                Swal.fire('Congrat!', 'Order was created.', 'success').then(() => {
                    navigate('/')
                    window.close()
                })
            }, 1500)
        }
    }
    return (
        <Button
            handleOnClick={() => handleSaveOrder()}
        >Payment orders</Button>
    )
}

export default withBase(Cash)