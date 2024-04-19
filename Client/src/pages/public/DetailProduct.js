import React, { useCallback, useEffect, useState } from "react";
//HOOKS REACT -router-dom
import { createSearchParams, useParams } from 'react-router-dom'
import { apiGetroduct, apiGetProducts, apiGetCart, apiUpdateWishlist, addProductToCart } from "../../apis";
import { Breadcrumbs, Button, SelectQuantity, ProductInformation, CustomSlider, SelectOptions } from "../../components";
import Slider from "react-slick/lib";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactImageMagnify from 'react-image-magnify';
import { formatMoney, formatPrice, renderStartFromNumber } from "../../ultils/helper";
import DOMPurify from 'dompurify';
import Swal from "sweetalert2";
import withBase from "../../hocs/withBase";
import { useSelector } from "react-redux";
import path from "../../ultils/path";
import { toast } from "react-toastify";
import { getCurrent } from "../../store/user/asyncActions";
import { FaHeart } from "react-icons/fa6";
import clsx from 'clsx'

import { getCart } from "../../store/cart/cartSlice";

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};

const DetailProducts = ({ navigate, dispatch, location }) => {
    const { current } = useSelector(state => state.user)

    const { pid, title, category } = useParams()

    const [quantity, setquantity] = useState(1)

    const [product, setproduct] = useState(null)

    const [varriants, setVarriants] = useState(null)

    const [currentImage, setCurrentImage] = useState(null)

    const [update, setUpdate] = useState(false)

    const [relatedProduct, setrelatedProduct] = useState(null)

    const [currentProduct, setCurrentProduct] = useState({
        title: '',
        thumb: '',
        images: [],
        price: '',
        color: '',
    })

    console.log('varriants  :>> ', varriants);
    const quantityCart = (+current?.cart.find(i => i.product._id.toString() === pid.toString())?.quantity)
    var countPrd = (product?.quantity) - (+current?.cart.find(i => i.product._id.toString() === pid.toString())?.quantity)
    if (!countPrd) {
        var countPrd = (product?.quantity)
    }


    const fetchProductData = async () => {
        const response = await apiGetroduct(pid)

        if (response.success) {
            setproduct(response.productData)
            setCurrentImage(response.productData?.thumb)

        }
    }
    useEffect(() => {
        if (varriants) {
            setCurrentProduct({
                title: product?.varriants?.find(el => el._id === varriants)?.title,
                color: product?.varriants?.find(el => el._id === varriants)?.color,
                images: product?.varriants?.find(el => el._id === varriants)?.images,
                price: product?.varriants?.find(el => el._id === varriants)?.price,
                thumb: product?.varriants?.find(el => el._id === varriants)?.thumb,

            })
        }
    }, [varriants])

    //latdata see mo
    const fetchProducts = async () => {
        const response = await apiGetProducts({ category })
        if (response.success) setrelatedProduct(response.products)
    }

    useEffect(() => {
        if (pid) {
            fetchProductData()
            fetchProducts()
        }
        window.scrollTo(0, 0)
    }, [pid])

    //
    useEffect(() => {
        if (pid) {
            fetchProductData()
        }
        window.scrollTo(0, 0)
    }, [update])
    const rerender = useCallback(() => { setUpdate(!update) }, [update])

    const handleQuantity = useCallback((number) => {

        const quantityCart = (+current.cart.find(i => i.product._id.toString() === pid.toString())?.quantity)
        if (quantityCart) {
            var countPrdd = (product?.quantity) - (+current.cart.find(i => i.product._id.toString() === pid.toString())?.quantity)

        }

        var countPrdd = (product?.quantity)

        if (!Number(number) || Number(number) < 1 || Number(number) > countPrdd) {
            setquantity(number)
            return toast.error('loi')
        }
        else {
            setquantity(number)
        }
    }, [quantity])


    // console.log('quantity :>> ', quantity);
    const handleChangeQuantity = useCallback((flag) => {

        // const updateCount = (product?.quantity) - 
        if (flag === 'minus' && quantity === 1) return
        if (flag === 'minus') setquantity(prev => +prev - 1)
        if (flag === 'plus') {
            setquantity(prev => {

                if (+prev >= countPrd) {
                    toast.error('Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này.')
                    console.log('0 :>> ');
                    return countPrd;
                } else {
                    return +prev + 1;
                }
            });
        }
    }, [quantity])

    const handleClickImage = (e, el) => {
        e.stopPropagation()
        setCurrentImage(el)
    }
    // const handleAddToCart = async () => {
    //     if (!current) return Swal.fire({
    //         title: 'Almost...',
    //         text: 'Please login first!',
    //         icon: 'info',
    //         cancelButtonText: 'Not now!',
    //         showCancelButton: true,
    //         confirmButtonText: 'Go login page'
    //     }).then((rs) => {
    //         if (rs.isConfirmed) navigate({
    //             pathname: `/${path.LOGIN}`,
    //             search: createSearchParams({ redirect: location.pathname }).toString()

    //         })

    //     })
    //     if (quantity > countPrd) {
    //         setquantity(countPrd)
    //         return toast.error("Bạn số lượng bạn có thể chọn là: " + countPrd)
    //     }
    //     else {
    //         const response = await apiUpdateCart({ pid, color: varriants ? currentProduct.color : product?.color, quantity, price: currentProduct.price || product.price, title: product?.title })

    //         if (response.success) {
    //             toast.success(response.message)
    //             dispatch(getCurrent())
    //         }
    //         else
    //             toast.error(response.message)
    //     }

    // }


    // useEffect(() => {
    //     const fetchCart = async () => {
    //         try {
    //             const cartData = await apiGetCart();
    //             console.log("XXX:::cartDatacartData", cartData);
    //             dispatch(getCart(cartData));
    //         } catch (error) {
    //             console.error("Failed to fetch cart:", error);
    //         }
    //     };

    //     fetchCart();
    // }, []);

    const handleAddToCart = async () => {
        if (!current) return Swal.fire({
            title: 'Almost...',
            text: 'Please login first!',
            icon: 'info',
            cancelButtonText: 'Not now!',
            showCancelButton: true,
            confirmButtonText: 'Go login page'
        }).then((rs) => {
            if (rs.isConfirmed) navigate({
                pathname: `/${path.LOGIN}`,
                search: createSearchParams({ redirect: location.pathname }).toString()
            })
        })
        if (quantity > countPrd) {
            setquantity(countPrd)
            return toast.error("Bạn số lượng bạn có thể chọn là: " + countPrd)
        }
        else {
            try {
                const response = await addProductToCart({
                    userId: current._id,
                    productId: pid,
                    quantity: varriants ? currentProduct.quantity : quantity,
                    color: varriants ? currentProduct.color : product?.color,
                    thumb: varriants ? currentProduct.thumb : product?.thumb,
                    price: varriants ? currentProduct.price : product?.price,
                });
                console.log("response:::XXXX", response);

                dispatch(getCart());
                dispatch(getCurrent());
                toast.success('The product was added successfully');
            } catch (error) {
                console.error(error);
                toast.error("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
            }
        }
    };



    const handleClickOptions = async (e, flag) => {
        e.stopPropagation()
        if (flag === 'WISHLIST') {
            const response = await apiUpdateWishlist(pid)
            if (response.success) {
                toast.success(response.message)
                dispatch(getCurrent())
            } else {
                toast.error(response.message)
            }
        }
    }

    return (
        <div className="w-full ">
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="w-main">
                    <h3 className="font-semibold">{currentProduct?.title || product?.title}</h3>
                    <Breadcrumbs title={currentProduct?.title || product?.title} category={category} />
                </div>
            </div>
            <div className="w-main m-auto mt-4 flex">
                <div className="w-2/5 flex-col flex gap-4">
                    <div className="h-[458px] w-[458px] overflow-hidden flex items-center justify-center object-cover-fill border">


                        <img src={varriants ? currentProduct.thumb : currentImage} className="w-[1800px] h-[1500px] object-contain p-2" />
                    </div>

                    <div className="w-[458px]">
                        <Slider className="images-slider" {...settings}>
                            {product?.images?.map(el => (
                                <div className="flex w-full gap-2" key={el}>
                                    <img onClick={e => handleClickImage(e, el)} src={el} alt="sub-product" className="h-[143px] w-[143px] object-cover-fill border " />
                                </div>
                            ))}
                        </Slider>
                    </div>
                    <div className="flex items-center gap-4">
                        <span
                            onClick={(e) => handleClickOptions(e, 'WISHLIST')}
                        >
                            <SelectOptions
                                icons={<FaHeart
                                    color={current?.wishlist?.some((i) => i._id === pid) ? 'red' : 'gray'}
                                />} />
                        </span>
                        {current?.wishlist?.some((i) => i._id === pid) && <div>Added to wish list</div>}
                    </div>
                </div>
                <div className=" w-2/5 flex flex-col gap-2">
                    <h2 className="text-[30px] font-semibold">{`${formatMoney(formatPrice(product?.price))} VNĐ`}</h2>
                    <div className="flex items-center gap-5">
                        <div className="flex items-center">{renderStartFromNumber(product?.totalRating)?.map((el, index) => (<span key={index}>{el}</span>))}</div>
                        <div className=" border-r pr-5">{`${product?.rating.length} Ratings`}</div>
                        <div className="mx-4 text-gray-500 ">{`${product?.sold || 0} Sold`}</div>
                    </div>

                    <ul className="pl-7 list-item text-sm text-gray-500">
                        {product?.description?.length > 1 && product?.description?.map(el => (<li key={el} className=" leading-6 list-disc">{el}</li>))}
                        {product?.description?.length === 1 && <div
                            className="text-sm"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description[0]) }}></div>}
                    </ul>
                    <div className="my-4 flex items-center gap-4">
                        <span className="font-bold">
                            Color:
                        </span>
                        <div className="flex flex-wrap gap-4 items-center w-full">
                            <div
                                onClick={() => setVarriants(null)}
                                className={clsx("flex items-center gap-2 p-2 border cursor-pointer", !varriants && 'border-red-500')}>
                                <img src={product?.thumb} alt="thumb" className="w-8 h-8 object-cover rounded-md" />
                                <span className="flex flex-col">
                                    <span>{product?.color} </span>
                                    <span className="text-sm">{product?.price}</span>
                                </span>
                            </div>
                            {product?.varriants?.map(el => (
                                <div
                                    onClick={() => setVarriants(el._id)}
                                    className={clsx("flex items-center gap-2 p-2 border cursor-pointer", varriants === el._id && 'border-red-500')}>
                                    <img src={el?.thumb} alt="thumb" className="w-8 h-8 object-cover rounded-md" />
                                    <span className="flex flex-col">
                                        <span>{el?.color} </span>
                                        <span className="text-sm">{el?.price}</span>
                                    </span>
                                </div>
                            ))

                            }
                        </div>
                    </div>
                    <div className="text-sm flex flex-col gap-8 ">
                        <div className="flex items-center">
                            <SelectQuantity
                                quantity={quantity}
                                handleQuantity={handleQuantity}
                                handleChangeQuantity={handleChangeQuantity}
                            />
                            <div className="mx-4 text-gray-500 ">{`${product?.quantity} Products available in stock`}</div>
                        </div>
                        <Button fw handleOnClick={handleAddToCart}>
                            Add to cart
                        </Button>

                    </div>
                </div>


            </div>
            <div className="w-main m-auto mt-8">
                <ProductInformation
                    totalRating={product?.totalRating}
                    rating={product?.rating}
                    nameProduct={product?.title}
                    pid={product?._id}
                    rerender={rerender} />
            </div>
            <div className="w-main m-auto mt-8">
                <h3 className="text-[20px] uppercase font-semibold py-[15px] border-2 border-t-main">OTHER CUSTINERS ALSO BUY:</h3>
                <CustomSlider normal={true} products={relatedProduct} />
            </div>

        </div>
    )
}
export default withBase(DetailProducts)