import React, { useEffect, useState } from 'react'
import { Pagination } from '../../components'
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';
import { useForm } from 'react-hook-form';
import { apiGetOrders } from '../../apis';
import moment from 'moment';
import avadf from '../../assets/avatar-default.jpg'
import { formatMoney, formatPrice } from '../../ultils/helper';

const ManageOrder = () => {
  const [editProduct, setEditProduct] = useState(null);


  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const { register, formState: { errors }, handleSubmit, reset, watch } = useForm()
  const [orders, setOrders] = useState(null)
  const [counts, setCounts] = useState(0)
  const handleSearchProducts = (data) => {
    console.log('data :>> ', data);
  }
  console.log('params :>> ', params);
  const fectchOrders = async (params) => {
    const response = await apiGetOrders({ ...params, limit: process.env.REACT_APP_LIMIT, sort: "-createdAt" })
    if (response.success) {
      console.log('response :>> ', response);
      setOrders(response.Orders)
      setCounts(response.counts)
    }
  }
  const queryDecounce = useDebounce(watch('q'), 800)


  //search
  useEffect(() => {
    if (queryDecounce) {

      navigate({
        pathname: location.pathname,
        search: createSearchParams({ q: queryDecounce }).toString()
      })
    } else {
      navigate({
        pathname: location.pathname
      })
    }
  }, [queryDecounce])
  //nosear
  useEffect(() => {
    const searchParams = Object.fromEntries([...params])
    console.log('object :>> ', searchParams);
    fectchOrders(searchParams)
  }, [params])



  // const handldeDeleteProduct = (pid) => {
  //   Swal.fire({
  //     title: 'Are you sure...',
  //     text: 'Are you ready remove this product?',
  //     showCancelButton: true
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {

  //       const response = await apiDeleteProduct(pid)
  //       if (response.success) {
  //         fectchProducts()
  //         toast.success(response.message)
  //       }
  //       else {
  //         toast.error(response.message)
  //       }
  //     }
  //   })
  // }
  return (
    <div className='w-full relative p-2'>

      <div className='flex justify-center items-center '>
        <h1 className="h-[75px] w-full flex justify-between items-center text-3xl font-bold px-4 border-b  top-0  ">
          <span>Manage Orders</span>
        </h1>
      </div>
      <div className="w-ful text-rightx">
        <table className="table-auto mb-6 w-full">
          <thead className="font-bold  text-[13px] border border-black text-center bg-sky-700 text-white">
            <tr>
              <th className="px-4 py-2 border border-black">Stt</th>
              <th className="px-4 py-2 border border-black">Products</th>
              <th className="px-4 py-2 border border-black">Total</th>
              <th className="px-4 py-2 border border-black">Status</th>
              <th className="px-4 py-2 border border-black">CreatedAt</th>
              <th className="px-4 py-2 border border-black">Order By</th>
              <th className="px-4 py-2 border border-black">Actions</th>


            </tr>
          </thead>
          <tbody>
            {orders?.map((el, idx) => (
              <tr key={el._id} className="text-center border border-black">
                <td className="p-2 border border-black text-center">{((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_LIMIT) + idx + 1}</td>
                <td className="p-2 border border-black text-center">
                  <span className='flex flex-col text-left'>
                    {el?.products.map(item => <span key={item._id}>
                      {`${item?.title} - ${item.color} - sl: ${item.quantity} - ${item.price} VND`}
                    </span>)}
                  </span>
                </td>
                <td className="p-2 border border-black text-center">{`${el?.total}$ = ${formatMoney(formatPrice(Math.round(+el?.total * 24761)))} VND`}</td>
                <td className="p-2 border border-black text-center">{el?.status}</td>
                <td className="p-2 border border-black text-center">{moment(el?.createdAt).format('DD/MM/YYYY')}</td>
                <td className="p-2 border border-black text-center">
                  <div className='flex items-center gap-2'><img src={el?.orderBy?.avatar || avadf} className='h-[30px] w-[30px] rounded-full object-contain' />
                    {`${el?.orderBy?.firstname} ${el?.orderBy?.lastname}`}</div></td>



                {/* <td className="py-4">
                  <span
                    className="px-2 text-orange-600 hover:underline cursor-pointer"
                    onClick={() => setEditProduct(el)}
                  >Edit
                  </span>
                  <span
                    onClick={() => handldeDeleteProduct(el._id)}
                    className='px-2 text-orange-600 hover:underline cursor-pointer'>Remove</span>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          name="orders"
          totalCount={counts} />
      </div>
    </div>
  )
}

export default ManageOrder