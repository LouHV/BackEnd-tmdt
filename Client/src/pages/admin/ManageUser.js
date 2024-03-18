import React, { useEffect, useState, useCallback } from 'react'
import { apiGetUsers } from '../../apis'
import moment from 'moment'
import { roles } from '../../ultils/contants'
import { InputField, Pagination, Select } from '../../components/index'
import useDebounce from '../../hooks/useDebounce'
import { useSearchParams } from 'react-router-dom';
import { InputForm } from '../../components'
import { useForm } from 'react-hook-form'

const ManageUser = () => {

  const { handleSubmit, register, formState: { errors } } = useForm(
    {
      email: '',
      firstname: '',
      lastname: '',
      role: '',
      phone: '',
      status: '',
    })

  const [users, setUsers] = useState(null)
  const [queries, setQueries] = useState({
    q: ''
  })

  const [editElm, setEditElm] = useState(null)

  const [params] = useSearchParams()
  const fectchUser = async (params) => {
    const response = await apiGetUsers({ ...params, limit: process.env.REACT_APP_LIMIT })
    if (response.success) setUsers(response)
  }

  const queriesDebounce = useDebounce(queries.q, 800)
  useEffect(() => {
    const queries = Object.fromEntries([...params])
    if (queriesDebounce) queries.q = queriesDebounce
    fectchUser(queries)
  }, [queriesDebounce, params])

  const handleUpdate = (data) => {
    console.log('data :>> ', data);
  }
  return (
    <div className='w-full'>
      <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>Manage Users</span>
      </h1>

      <div className='w-full p-4'>
        <div className='flex items-center justify-end py-4 '>

          <InputField
            nameKey={'q'}
            value={queries.q}
            setValue={setQueries}
            style={'w-[500px]'}
            placeholder='search name user...'
            isHideLabel
          />


        </div>
        <table className='table-auto mb-6 w-full'>
          <thead className='font-bold  text-[13px] border border-black text-center'>
            <tr>
              <th className='px-4 py-2'>Stt</th>
              <th className='px-4 py-2'>Email Adress</th>
              <th className='px-4 py-2'>Fisrtname</th>
              <th className='px-4 py-2'>Lastname</th>
              <th className='px-4 py-2'>Address</th>
              <th className='px-4 py-2'>Phone</th>
              <th className='px-4 py-2'>Role</th>
              <th className='px-4 py-2'>Status</th>
              <th className='px-4 py-2'>createdAt</th>
              <th className='px-4 py-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.Users?.map((el, idx) => (

              <tr key={el._id} className='text-center border border-black'>
                <td className='py-4'>{idx + 1}</td>
                <td className='py-4'>
                  {editElm?._id === el._id
                    ? <InputForm
                      register={register}
                      errors={errors}
                      defaultValue={editElm?.email}
                      fullWidth
                      id={'email'}
                      validate={{ required: true }}
                    />
                    : <span>{el.email}</span>}</td>
                <td className='py-4'>
                  {editElm?._id === el._id
                    ? <InputForm
                      register={register}
                      errors={errors}
                      defaultValue={editElm?.firstname}
                      fullWidth
                      id={'firstname'}
                      validate={{ required: true }} />
                    : <span>{el.firstname}</span>} </td>
                <td className='py-4'>
                  {editElm?._id === el._id
                    ? <InputForm
                      register={register}
                      errors={errors}
                      defaultValue={editElm?.lastname}
                      fullWidth
                      id={'lastname'}
                      validate={{ required: true }} />
                    : <span>{el.lastname}</span>}</td>
                <td className='py-4'>{el.address}</td>
                <td className='py-4'>
                  {editElm?._id === el._id
                    ? <InputForm
                      register={register}
                      errors={errors}
                      defaultValue={editElm?.mobile}
                      fullWidth
                      id={'mobile'}
                      validate={{ required: true }} />
                    : <span>{el.mobile}</span>}</td>
                <td className='py-4'>
                  {editElm?._id === el._id
                    ? <Select /> : <
                      span>{roles.find(role => +role.code === +el.role)?.value}</span>}</td>
                <td className='py-4'>
                  {editElm?._id === el._id
                    ? <Select /> : <
                      span>{el.isBlocked ? 'Blocked' : 'Active'}</span>}</td>
                <td className='py-4'>{moment(el.createdAt).format('DD/MM/YYYY')}</td >
                <td className='py-4'>
                  <span
                    className='px-2 text-orange-600 hover:underline cursor-pointer'
                    onClick={() => setEditElm(el)}
                  >Edit</span>
                  <span className='px-2 text-orange-600 hover:underline cursor-pointer'>Delete</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='w-ful text-rightx'>
          <Pagination
            totalCount={users?.counts}
          />
        </div>
      </div>
    </div>
  )
}

export default ManageUser