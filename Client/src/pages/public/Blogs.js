import React, { useEffect, useState } from "react";
import { Breadcrumbs } from "../../components";
import { useSelector } from "react-redux";
import { apiGetBlogs } from "../../apis";
import withBase from "../../hocs/withBase";
import { getBlogs } from "../../store/blogs/asyncActions";
import BlogsItems from "./BlogsItems";
import { format } from "date-fns";
const Blogs = ({ dispatch, navigate }) => {


    const [topblog, setTopblog] = useState(null);

    const { blogs } = useSelector(state => state.blogs)
    const fectchBlogs = async () => {
        const response = await apiGetBlogs({ sort: '-createdAt', limit: 3 })
        if (response.success) setTopblog(response);
    };
    useEffect(() => {
        fectchBlogs()
        dispatch(getBlogs())
    }, [])
    console.log('topblog :>> ', topblog);
    return (
        <div className="w-full">
            <div className='h-[50px] flex justify-center items-center bg-gray-100 mb-[20px]'>
                <div className="w-main">
                    {/* <h3 className='font-semibold uppercase'>My  Cart</h3> */}
                    <Breadcrumbs />
                </div>
            </div>
            <div className="w-main mx-auto grid grid-cols-10 gap-4">
                <div className="m-auto col-span-7">
                    {blogs?.map(el => (
                        <BlogsItems el={el} key={el.id} />
                    ))}
                </div>
                <div className="col-span-3  ">
                    <div className="flex h-[50px] border bg-main w-full justify-start items-center text-white gap-2 p-4">
                        <span className="text-2xl font-bold">RECENT ARTICLES</span>
                    </div>
                    <div className="border p-[20px]">

                        {topblog?.blogs?.map(el => (
                            <div el={el} key={el.id} className="">
                                <span className=" text-lg hover:text-main cursor-pointer"
                                    onClick={e => navigate(`/blogs/${el?._id}/${el?.title_blog}`)}
                                >{el?.title_blog}</span>
                                <div className='text-gray-400 text-sm mb-[20px] mt-[8px] '>
                                    <span className=''>{`${format(el?.createdAt, 'MMM dd, yyyy')}`}</span>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}
export default withBase(Blogs)