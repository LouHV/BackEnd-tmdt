import React from "react";
import { Banner, Sidebar, BestSellers } from '../../components'


const Public = () => {

    return (
        <>
            <div className="w-Main flex">
                <div className="flex flex-col gap-5 w-[20%] flex-auto">
                    <Sidebar />
                </div>
                <div className="flex flex-col gap-5 pl-5 w-[80%] flex-auto ">
                    <Banner />
                    <BestSellers />
                </div>
            </div>
            <div className="w-full h-[500px]">wsdad</div>
        </>

    )
}
export default Public