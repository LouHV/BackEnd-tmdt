import React, { useCallback, useState, useEffect, useRef } from 'react'
import { InputForm, Select, Button, MarkdownEditor, Loading } from '../../components'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { invalidate, fileTobase64 } from '../../ultils/helper'
import { toast } from 'react-toastify'
import { ImBin } from "react-icons/im";
import { apiCreateCoupon } from '../../apis'
import { showModal } from '../../store/app/appSlice'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Calendar, DateRange } from 'react-date-range';
import { format } from 'date-fns'


const CreateCoupon = () => {
  const dispatch = useDispatch()
  const { register, formState: { errors }, reset, handleSubmit } = useForm();
  const [canlender, setCanlender] = useState('')
  

  
  //tao coupon
  const handleCreateCoupon = async (data) => {
    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
    const response = await apiCreateCoupon(data)
    dispatch(showModal({ isShowModal: false, modalChildren: null }))

    if (response.success) {
      toast.success(response.message)
      reset()
    } else {
      toast.error(response.message)
    }

  };
  const [open, SetOpen] = useState(false)

  useEffect(() => {
    setCanlender(format(new Date(), 'yyyy-MM-dd'))
    document.addEventListener('keydown', hideOnEscape, true)
    document.addEventListener('click', hideOnClickOutside, true)

  }, [])

  const refOne = useRef(null)

  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      SetOpen(false)
    }
  }
  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      SetOpen(false)
    }
  }

  const handleSelect = (date) => {
    setCanlender(format(date, 'yyyy-MM-dd'))
  }
  

  return (
    <div className='w-full'>
      <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>Create new Coupon</span>
      </h1>
      <div className='p-4'>
        <form onSubmit={handleSubmit(handleCreateCoupon)}>


          <InputForm
            label='Name coupon'
            register={register}
            errors={errors}
            id='name_coupon'
            validate={{
              required: 'Need fill this filed'
            }}
            fullWidth
            placeholder='Name of new coupon'
          />
          <div className='w-full my-6 flex gap-4'>
            <InputForm
              label='Discount'
              register={register}
              errors={errors}
              id='discount'
              validate={{
                required: 'Need fill this filed'
              }}
              style='flex-auto'
              placeholder='Discount of new coupon'
              type='number'
            />
            <InputForm
              label='Quantity'
              register={register}
              errors={errors}
              id='quantity'
              validate={{
                required: 'Need fill this filed'
              }}
              style='flex-auto'
              placeholder='Quantity of new coupon'
              type='number'
            />

          </div>
          <div className='w-full my-6 flex gap-4' >
            <div>
              <div className='flex flex-col h-[78px] gap-3'>
                <lable htmlFor='start_date'>
                  Start Day
                </lable>
                <input
                  value={canlender}
                  readOnly
                  onClick={() => SetOpen(open => !open)}
                  className='input-box form-input p-2 w-full border'
                  id='start_date'
                  {...register("start_date", { required: true })}
                /></div>

              <div ref={refOne}>
                {open && <DateRange
                  date={new Date()}
                  onChange={handleSelect}
                  className='calendarElement'
                />}
              </div>
            </div>
            <InputForm
              label='Expiry'
              register={register}
              errors={errors}
              id='expiry'
              validate={{
                required: 'Need fill this filed'
              }}
              style='flex-auto'
              placeholder='Expiry of new coupon'
              type='text'
            />
          </div>
          <div className='mt-4'>
            <Button type='submit'>Create new coupon</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCoupon