import React, { useState, useEffect, memo } from "react";
import { apiGetProducts } from "../../apis/product";
import { Product, CustomSlider } from '..';
import { getNewproducts } from "../../store/products/asyncActions";
import { useDispatch, useSelector } from "react-redux";


const tabs = [
    { id: 1, name: 'Best Seller' },
    { id: 2, name: 'News Arrivals' }
];



const BestSeller = () => {
    const [bestSellers, setBestSellers] = useState(null);
    const [activedTab, setActivedTab] = useState(1);
    const [products, setProducts] = useState(null);
    const dispatch = useDispatch()
    const {newProducts} = useSelector(state => state.products)


    const fetchProducts = async () => {
        const response = await apiGetProducts({ sort: '-sold' })
        if (response.success) {
            setBestSellers(response.products);
            setProducts(response.products);
        }

    };

    useEffect(() => {
        fetchProducts();
        dispatch(getNewproducts())
    }, []);

    useEffect(() => {
        if (activedTab === 1 && bestSellers) {
            setProducts(bestSellers);
        }
        if (activedTab === 2 && newProducts) {
            setProducts(newProducts);
        }
    }, [activedTab, bestSellers, newProducts]);

    return (
        <div>
            <div className="flex text-[20px] pb-4 border-b-2 border-main">
                {tabs.map(el => (
                    <span
                        key={el.id}
                        className={`font-semibold capitalize px-8 border-r cursor-pointer text-gray-400 ${activedTab === el.id ? 'text-gray-900' : ''}`}
                        onClick={() => { setActivedTab(el.id); }}
                    >
                        {el.name}
                    </span>
                ))}
            </div>
            <div className="mt-4 mx-[10px]">
                <CustomSlider products={products} activedTab={activedTab}></CustomSlider>
            </div>
        </div>
    );
};

export default memo(BestSeller);