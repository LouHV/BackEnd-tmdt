import React from "react";
//HOOKS REACT -router-dom
import { useParams } from 'react-router-dom'

const DetailProducts = () => {
    const { pid, title } = useParams()
    console.log('pid :>> ', pid);
    console.log('pid :>> ', title);

    return (
        <div>Detail Products</div>
    )
}
export default DetailProducts