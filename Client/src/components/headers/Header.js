import React, { Fragment, memo } from "react";
import logo from '../../assets/logo.png'
import icons from '../../ultils/icons'
import { Link } from "react-router-dom";
import path from "../../ultils/path";
import { useSelector } from 'react-redux'

const Header = () => {
    const { FaCartShopping, FaRegHeart, IoSearch } = icons
    const { current } = useSelector(state => state.user)
    console.log('current :>> ', current);
    return (
        <div className=" w-main flex justify-between h-[110px] py-[35px]">
            <img src={logo} alt="logo" className="w-[234px] object-contain" />
            <div className="flex items-center justify-center w-[40%]" style={{ border: '2px solid red', borderRadius: '4px 0px 0px 4px' }}>
                <input type="text" placeholder="Search..." className="w-[100%] h-[100%] px-[5px]" />
                <button className="flex items-center justify-center" style={{ backgroundColor: 'red', color: 'white', height: '100%', width: '10%' }}><IoSearch size={23} /></button>

            </div>
            <div className="flex px-5">
                <div></div>
                <div className="flex items-center justify-center">
                    <FaRegHeart color="red" />
                </div>
                <div className="flex items-center justify-center gap-2 px-5">
                    <FaCartShopping color="red" />
                    <span>0 item(s)</span>
                </div>
                {current && <Fragment>
                    <Link className="flex cursor-pointer items-center justify-center px-6 gap-2"
                        to={+current?.role === 0 ? `/${path.ADMIN}/${path.DASHBOARD}` : `/${path.MEMBER}/${path.PERSONAL}`}>
                        Pròile
                    </Link>
                </Fragment>
                }
            </div>
        </div>

    )
}
export default memo(Header)