import React, { useCallback, useEffect, useState } from "react";
//HOOKS REACT -router-dom
import { useParams } from 'react-router-dom'
import { apiGetroduct, apiGetProducts } from "../../apis";
import { Breadcrumbs, Button, SelectQuantity, ProductInformation, CustomSlider } from "../../components";
import Slider from "react-slick/lib";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactImageMagnify from 'react-image-magnify';
import { formatMoney, formatPrice, renderStartFromNumber } from "../../ultils/helper";
import DOMPurify from 'dompurify';

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};

const DetailProducts = () => {
    const { pid, title, category } = useParams()

    const [quantity, setquantity] = useState(1)

    const [product, setproduct] = useState(null)

    const [currentImage, setCurrentImage] = useState(null)

    const [update, setUpdate] = useState(false)

    const [relatedProduct, setrelatedProduct] = useState(null)

    const fetchProductData = async () => {
        const response = await apiGetroduct(pid)
        if (response.success) {
            setproduct(response.productData)
            setCurrentImage(response.productData?.thumb)
        }
    }

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
        
        if (!Number(number) || Number(number) < 1) {
            return
        } else {
            setquantity(number)
        }
    }, [quantity])

    const handleChangeQuantity = useCallback((flag) => {
        if (flag === 'minus' && quantity === 1) return
        if (flag === 'minus') setquantity(prev => +prev - 1)
        if (flag === 'plus') setquantity(prev => +prev + 1)
    }, [quantity])

    const handleClickImage = (e, el) => {
        e.stopPropagation()
        setCurrentImage(el)
    }

    return (
        <div className="w-full ">
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="w-main">
                    <h3 className="font-semibold">{title}</h3>
                    <Breadcrumbs title={title} category={category} />
                </div>
            </div>
            <div className="w-main m-auto mt-4 flex">
                <div className="w-2/5 flex-col flex gap-4">
                    <div className="h-[458px] w-[458px] overflow-hidden flex items-center justify-center object-cover-fill border border-red-300">
                        <ReactImageMagnify {...{
                            smallImage: {
                                alt: 'Wristwatch by Ted Baker London',
                                isFluidWidth: true,
                                src: currentImage
                            },
                            largeImage: {
                                src: currentImage,
                                width: 1800,
                                height: 1500
                            }
                        }} />
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
                </div>
                <div className="border border-blue-300 w-2/5 flex flex-col gap-2">
                    <h2 className="text-[30px] font-semibold">{`${formatMoney(formatPrice(product?.price))} VNĐ`}</h2>
                    <div className="flex items-center gap-5">
                        <div className="flex items-center mt-2 bg-red">{renderStartFromNumber(product?.totalRating)?.map((el, index) => (<span key={index}>{el}</span>))}</div>
                        <div className=" border-r pr-5">{`${product?.rating.length} Ratings`}</div>
                        <div>{`${product?.quantity} Quantity`}</div>
                    </div>

                    <ul className="pl-7 list-item text-sm text-gray-500">
                        {product?.description?.length > 1 && product?.description?.map(el => (<li key={el} className=" leading-6 list-disc">{el}</li>))}
                        {product?.description?.length === 1 && <div 
                        className="text-sm"
                        dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(product?.description[0])}}></div>}
                    </ul>
                    <div className="text-sm flex flex-col gap-8 ">
                        <SelectQuantity
                            quantity={quantity}
                            handleQuantity={handleQuantity}
                            handleChangeQuantity={handleChangeQuantity} />
                        <Button fw>
                            Add to cart
                        </Button>
                    </div>
                </div>
                <div className="border border-green-300 w-1/5">
                    information
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
            <div className="h-[500px]"></div>
        </div>
    )
}
export default DetailProducts