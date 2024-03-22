import React, { memo, useState } from "react";
import { formatMoney } from '../../ultils/helper'
import trending from '../../assets/trending.png'
import label from '../../assets/new.png'
import { renderStartFromNumber } from '../../ultils/helper'
import { SelectOptions } from '..'
import icons from "../../ultils/icons";
import {Link} from 'react-router-dom'
import path from "../../ultils/path";

const { FaRegEye, FaHeart, IoMenu } = icons

const Product = ({ productData, isNew, normal }) => {
    const [isShowOption, setIsShowOption] = useState(false)
    return (
        <div className="w-full text-base px-[10px]">
            <Link className="w-full border p-[15px] flex flex-col items-center rounded-[8px]"
            to={`/${productData?.category }/${productData?._id}/${productData?.title}`}
                onMouseEnter={e => {
                    e.stopPropagation()
                    setIsShowOption(true)
                }}
                onMouseLeave={e => {
                    e.stopPropagation()
                    setIsShowOption(false)
                }}
            >
                <div className="w-full relative">
                    {isShowOption && <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 animate-slide-top">
                        <SelectOptions icons={<FaHeart />} />
                        <SelectOptions icons={<IoMenu />} />
                        <SelectOptions icons={<FaRegEye />} />
                    </div>}

                    <img src={productData?.thumb || 'https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg'}
                        alt=''
                        className="w-[274px] h-[274px] object-cover" />
                    {!normal&&<img
                        src={isNew ? label : trending}
                        alt=""
                        className={`absolute w-[100px] h-[40px] top-[0] right-[0] objcet-cover`} />}

                </div>
                <div className="flex flex-col mt-[15px] items-start gap-1 w-full">
                    <span className="flex h-4">{renderStartFromNumber(productData?.totalRating)?.map((el,index)=>(
                        <span key={index}>{el}</span>
                    ))}</span>
                    <span className="line-clamp-1 hover:text-main cursor-pointer">{productData?.title}</span>
                    <span>{`${formatMoney(productData?.price)} VNĐ`}</span>
                </div>
            </Link>
        </div >
    )
}

export default memo(Product)