import clsx from 'clsx'
import React, { memo } from 'react'

const InputForm = ({ label, disabled, register, errors, id, validate, type = 'text', placeholder, fullWidth, defaultValue, style, readOnly }) => {
    return (
        <div className={clsx('flex flex-col h-[78px] gap-2', style)}>
            {<lable htmlFor={id}>
                {label}
            </lable>}
            <input
                type={type}
                id={id}
                {...register(id, validate)}
                disabled={disabled}
                placeholder={placeholder}
                className={clsx('form-input p-2', fullWidth && 'w-full', style)}
                defaultValue={defaultValue}
                readOnly={readOnly}
            />
            {errors[id] && <small className='text-xs text-red-500'>{errors[id]?.message}</small>}
        </div>
    )
}

export default memo(InputForm)