import React, { useEffect } from "react";
//HOOKS REACT -router-dom
import { useParams } from 'react-router-dom'
import { apiGetroduct } from "../../apis";

const DetailProducts = () => {
    const { pid, title } = useParams()

    console.log('prdId :>> ', pid);
    const fetchProductData = async()=>{
        const response = await apiGetroduct(pid)
        console.log('response :>> ', response);
    }
    useEffect(()=>{
        if(pid){
            fetchProductData()
        }
    },[pid])
    return (
        <div className="w-full">
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="w-main">
                    <h3>{title}</h3>
                </div>
            </div>
        </div>
    )
}
export default DetailProducts