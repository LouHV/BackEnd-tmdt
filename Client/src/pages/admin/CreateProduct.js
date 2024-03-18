import React, { useCallback, useState, useEffect } from 'react'
import { InputForm, Select, Button, MarkdownEditor } from '../../components'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { invalidate, fileTobase64 } from '../../ultils/helper'
import { toast } from 'react-toastify'

const CreateProduct = () => {

  const { categories } = useSelector(state => state.app);
  const { register, formState: { errors }, reset, handleSubmit, watch } = useForm();

  const [payload, setPayload] = useState({
    description: '',
  });

  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
  })

  const [invalidFields, setInvalidFields] = useState([]);

  const changeValue = useCallback((e) => {

    setPayload(e);
  }, [payload]);

  //xử lý 1 ảnh
  const handlePreviewThumb = async (file) => {
    const base64Thumb = await fileTobase64(file)
    setPreview(prev => ({ ...prev, thumb: base64Thumb }))
  }

  const handlePreviewImages = async (files) => {
    const imagesPreview = []
    for (let file of files) {
      if (file.type !== 'image/png' || file.type !== 'image/jpg') {
        toast.warning('File not supported!')
        return
      }

      const base64 = await fileTobase64(file)
      imagesPreview.push('base64')

    }
    if (imagesPreview.length > 0) setPayload(prev => ({ ...prev, images: imagesPreview }))
    console.log('imagesPreview :>> ', imagesPreview);
  }

  useEffect(() => {
    handlePreviewThumb(watch('thumb')[0])

  }, [watch('thumb')])

  


  const handleCreateProduct = (data) => {
    const invalids = invalidate(payload, setInvalidFields)
    if (invalids === 0) {
      if (data.category) data.category = categories?.find(el => el._id === data.category)?.title;
      const finalPayload = { ...data, ...payload }

      const formData = new FormData()
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])
    }
  };

  return (
    <div className='w-full'>
      <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>Create new product</span>
      </h1>
      <div className='p-4'>
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <InputForm
            label='Name product'
            register={register}
            errors={errors}
            id='title'
            validate={{
              required: 'Need fill this filed'
            }}
            fullWidth
            placeholder='Name of new product'
          />
          <div className='w-full my-6 flex gap-4'>
            <InputForm
              label='Price'
              register={register}
              errors={errors}
              id='price'
              validate={{
                required: 'Need fill this filed'
              }}
              style='flex-auto'
              placeholder='Price of new product'
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
              placeholder='Quantity of new product'
              type='number'
            />
            <InputForm
              label='Color'
              register={register}
              errors={errors}
              id='color'
              validate={{
                required: 'Need fill this filed'
              }}
              style='flex-auto'
              placeholder='Color of new product'
              type='text'
            />

          </div>
          <div className='w-full my-6 flex gap-4'>
            <Select
              label='Category'
              options={categories?.map(el => ({ code: el._id, value: el.title }))}
              register={register}
              id='category'
              validate={{ required: 'Need fill this filed' }}
              style='flex-auto'
              errors={errors}
              fullWidth
            />
            <Select
              label='Brand (Optional)'
              options={categories?.find(el => el._id === watch('category'))?.brand?.map(el => ({ code: el, value: el }))}
              register={register}
              id='brand'
              style='flex-auto'
              errors={errors}
              fullWidth
            />
          </div>
          <MarkdownEditor
            name='description'
            changeValue={changeValue}
            label='Description'
            invalidFields={invalidFields}
            setInvalidField={setInvalidFields}
          />


          <div className='flex flex-col gap-2 mt-4'>
            <label htmlFor='thumb' className='font-semibold'>Upload thumb</label>
            <input
              type='file'
              id='thumb'
              {...register('thumb', { required: 'Need fill' })}

            />
            {errors['thumb'] && <small className='text-xs text-red-500'>{errors['thumb']?.message}</small>}
          </div>
          {preview?.thumb &&
            <div className='my-4'>
              <img src={preview?.thumb} alt='Thumbnail' className='w-[200px] object-contain' />
            </div>
          }

          <div className='flex flex-col gap-2 mt-4'>
            <label htmlFor='products' className='font-semibold'>Upload images of product</label>
            <input
              type='file'
              id='products'
              multiple
              {...register('images', { required: 'Need fill' })}
            />
            {errors['images'] && <small className='text-xs text-red-500'>{errors['images']?.message}</small>}
          </div>
          {preview?.images.length>0 &&
            <div className='my-4 flex w-full gap-2 flex-wrap'>
              {preview.images?.map((el,idx)=>(
                <img key={idx} src={el} alt='product' className='w-[200px] object-contain' />
              ))}
            </div>
          }
          <div className='mt-4'>
            <Button type='submit'>Create new product</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProduct