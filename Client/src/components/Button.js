import React from 'react'

const Button = ({ nameButton, handleOnClick, style, iconBefore, iconAfter, fw }) => {
    return (
        <button
            type='button'
            className={style ? style : `px-4 py-2 rounded-md text-white my-2 bg-main text-semibold ${fw ? 'w-full' : 'w-fit'}`}
            onClick={() => { handleOnClick && handleOnClick() }}
        >
            {iconBefore}
            <span>{nameButton}</span>
            {iconAfter}
        </button>
    )
}

export default Button