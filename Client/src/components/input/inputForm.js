import clsx from 'clsx'
import React, { memo } from 'react'

const InputForm = ({ label, disabled, register, errors, id, validate, type = 'text', placeholder, fullWidth, defaultValue }) => {
    return (
        <div className='flex flex-col h-[78px] gap-2'>
            {<lable htmlFor={id}>
                {label}
            </lable>}
            <input
                type={type}
                id={id}
                {...register(id, validate)}
                disabled={disabled}
                placeholder={placeholder}
                className={clsx('form-input', fullWidth && 'w-full')}
                defaultValue={defaultValue}
            />
            {errors[id] && <small className='text-xs text-red'>{errors[id]?.message}</small>}
        </div>
    )
}

export default memo(InputForm)