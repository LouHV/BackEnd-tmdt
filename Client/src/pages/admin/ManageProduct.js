import React, { useEffect, useState } from 'react'
import { InputForm } from '../../components'
import { useForm } from 'react-hook-form'
import { apiGetProducts } from '../../apis'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import moment from "moment";
import { useSearchParams, useParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { Pagination } from '../../components'
import useDebounce from '../../hooks/useDebounce'


const ManageProduct = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const { register, formState: { errors }, handleSubmit, reset, watch } = useForm()
  const [products, setProducts] = useState(null)
  const [counts, setCounts] = useState(0)
  const handleSearchProducts = (data) => {
    console.log('data :>> ', data);
  }


  const fectchProducts = async (params) => {
    const response = await apiGetProducts({ ...params, limit: process.env.REACT_APP_LIMIT })
    console.log('response :>> ', response);
    if (response.success) {
      setProducts(response.products)
      setCounts(response.counts)
    }
  }

  const queryDecounce = useDebounce(watch('q'), 800)
  console.log('queryDecounce :>> ', queryDecounce);

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

    fectchProducts(searchParams)
  }, [params])


  return (
    <div className='w-full relative'>
      <div className='flex justify-center items-center bg-slate-500'>
        <h1 className="h-[75px] w-full flex justify-between items-center text-3xl font-bold px-4 border-b  top-0  ">
          <span>Manage Product</span>
        </h1>

        <form className='w-[45%] px-4  justify-center items-center ' onSubmit={handleSubmit(handleSearchProducts)}>
          <InputForm
            id='q'
            register={register}
            errors={errors}
            fullwidth
            placeholder='search by title, desscription'
          />
        </form>

      </div>

      <div className='w-full mt-[55px] p-4'>

        <table className="table-auto mb-6 w-full">
          <thead className="font-bold  text-[13px] border border-black text-center bg-sky-700 text-white">
            <tr>
              <th className="px-4 py-2 border border-black">Stt</th>
              <th className="px-4 py-2 border border-black">Title</th>
              <th className="px-4 py-2 border border-black">Description</th>
              <th className="px-4 py-2 border border-black">Brand</th>
              <th className="px-4 py-2 border border-black">Thumb</th>
              <th className="px-4 py-2 border border-black">Price</th>
              <th className="px-4 py-2 border border-black">Category</th>
              <th className="px-4 py-2 border border-black">Quantity</th>
              <th className="px-4 py-2 border border-black">Sold</th>
              <th className="px-4 py-2 border border-black">Color</th>
              <th className="px-4 py-2 border border-black">Ratings</th>
              <th className="px-4 py-2 border border-black">CreatedAt</th>


            </tr>
          </thead>
          <tbody>
            {products?.map((el, idx) => (
              <tr key={el._id} className="text-center border border-black">
                <td className="p-2 border border-black text-center">{((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_LIMIT) + idx + 1}</td>
                <td className="p-2 border border-black text-center">{el?.title}</td>
                <td className="p-2 border border-black text-center">{el?.description}</td>
                <td className="p-2 border border-black text-center">{el?.brand}</td>
                <td className="p-2 border border-black text-center">
                  <img src={el?.thumb} alt='thumb' className=' w-12 h-12 object-cover' />
                </td>
                <td className="p-2 border border-black text-center ">{el?.price}</td>
                <td className="p-2 border border-black text-center">{el?.category}</td>
                <td className="p-2 border border-black text-center">{el?.quantity}</td>
                <td className="p-2 border border-black text-center">{el?.slod}</td>
                <td className="p-2 border border-black text-center">{el?.color}</td>
                <td className="p-2 border border-black text-center">{el?.rating?.length}</td>
                <td className="p-2 border border-black text-center">{moment(el?.createdAt).format('DD/MM/YYYY')}</td>



                {/* <td className="py-4">
                  <span
                    className="px-2 text-orange-600 hover:underline cursor-pointer"
                    onClick={() => handleOpenModal(el)}
                  >
                    Edit
                  </span>
                  <span onClick={() => handldeDeleteUser(el._id)} className='px-2 text-orange-600 hover:underline cursor-pointer'>Delete</span>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-ful text-rightx">
          <Pagination totalCount={counts} />
        </div>
      </div>
    </div>
  )
}

export default ManageProduct