import React, { memo, useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import { createSearchParams, useNavigate, useParams } from 'react-router-dom';
import { colors } from '../ultils/contants';
import { apiGetProducts } from '../apis';
import useDebounce from '../hooks/useDebounce';

const SearchItem = ({ name, activeClick, changeActiveFilter, type = 'checkbox' }) => {
    const navigate = useNavigate();
    const { category } = useParams();
    const [selected, setSelected] = useState([]);
    const [price, setPrice] = useState({
        from: 0,
        to: 0
    });
    const [bestPrice, setBestPrice] = useState(null);

    const handleSelect = (e) => {
        const alreadyEl = selected.includes(e.target.value);
        if (alreadyEl) {
            setSelected(prev => prev.filter(el => el !== e.target.value));
        } else {
            setSelected(prev => [...prev, e.target.value]);
        }
        changeActiveFilter(null);
    };

    const fetchBestPriceProduct = async () => {
        const response = await apiGetProducts({ sort: '-price', limit: 1 });
        if (response.success) {
            setBestPrice(response.products[0]?.price);
        }
    };

    useEffect(() => {
        if (selected.length > 0) {
            navigate({
                pathname: `/${category}`,
                search: createSearchParams({
                    color: selected.join(',')
                }).toString()
            });
        } else {
            navigate(`/${category}`);
        }
    }, [selected, category, navigate]);

    //price max
    useEffect(() => {
        if (type === 'input') {
            fetchBestPriceProduct();
        }
    }, [type]);


    //price from to
    const debouncedPriceFrom = useDebounce(price.from, 500);
    const debouncedPriceTo = useDebounce(price.to, 500);

    useEffect(() => {
        const validPrice = Number(price.from) > 0 && Number(price.to) > 0 && price.to > 0;
        if (validPrice) {
            navigate({
                pathname: `/${category}`,
                search: createSearchParams({
                    from: price.from,
                    to: price.to
                }).toString()
            });
        } else {
            navigate(`/${category}`);
        }
    }, [debouncedPriceFrom, debouncedPriceTo]);

    return (
        <div className='p-4 text-xs text-gray-500 gap-6 border border-gray-800 flex justify-between items-center relative' onClick={() => changeActiveFilter(name)}>
            <span>{name}</span>
            <FaChevronDown />
            {activeClick === name && (
                <div className='absolute top-[calc(100%+1px)]  min-w-[150px] left-0 w-fit p-4 bg-white z-10 border border-gray-400'>
                    {type === 'checkbox' &&
                        <div className='p-2'>
                            <div className='p-4 items-center flex justify-between gap-4'>
                                <span className='whitespace-nowrap'>{`${selected.length} selected`}</span>
                                <span
                                    onClick={e => {
                                        e.stopPropagation();
                                        setSelected([]);
                                    }}
                                    className='underline cursor-pointer hover:text-main'>reset</span>
                            </div>
                            <div onClick={e => e.stopPropagation()} className='flex flex-col gap-3'>
                                {colors.map((el, index) => (
                                    <div key={index} className='flex items-center gap-2'>
                                        <input
                                            type='checkbox'
                                            key={index}
                                            value={el}
                                            onChange={handleSelect}
                                            id={el}
                                            checked={selected.includes(el)}
                                        />
                                        <label htmlFor={el}>{el}</label>
                                    </div>
                                ))}
                            </div>
                        </div>}
                    {type === 'input' &&
                        <div onClick={e => e.stopPropagation()} >
                            <div className='p-4 items-center flex justify-between gap-4 '>
                                <span className='whitespace-nowrap'>{`The highest price is ${Number(bestPrice).toLocaleString()} VND`}</span>
                                <span
                                    onClick={e => {
                                        e.stopPropagation();
                                        setPrice({
                                            from: '',
                                            to: ''
                                        })
                                        changeActiveFilter(null)
                                    }}
                                    className='underline cursor-pointer hover:text-main'>reset</span>
                            </div>
                            <div className='flex items-center p-2 gap-2 '>
                                <div className='flex items-center gap-2'>
                                    <label htmlFor='from'>From</label>
                                    <input
                                        className='form-input h-[40px] text-[14px] p-2 border border-red-500'
                                        type='number'
                                        id='from'
                                        value={price.from}
                                        onChange={e => setPrice(prev => ({ ...prev, from: e.target.value }))}
                                    />
                                </div>
                                <div className='flex items-center gap-2'>
                                    <label htmlFor='to'>To</label>
                                    <input
                                        className='form-input h-[40px] text-[14px] p-2 border border-red-500'
                                        type='number'
                                        id='to'
                                        value={price.to}
                                        onChange={e => setPrice(prev => ({ ...prev, to: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>}
                </div>
            )}
        </div>
    );
};

export default memo(SearchItem);
