import React, { memo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import path from '../ultils/path'
import Swal from 'sweetalert2'
import { getCurrent } from '../store/user/asyncActions'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosLogOut } from 'react-icons/io'
import { logout, clearMessage } from '../store/user/userSlice'

const TopHeader = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoggedIn, current, message } = useSelector(state => state.user)

  useEffect(() => {
    const setTimeoutId = setTimeout(() => {
      if (isLoggedIn) dispatch(getCurrent())
    }, 500)
    return () => {
      clearTimeout(setTimeoutId)
    }
  }, [dispatch, isLoggedIn])
  useEffect(() => {
    if (message) Swal.fire('Opp!', message, 'info').then(() => {
      dispatch(clearMessage())
      navigate(`/${path.LOGIN}`)

    })
  }, [])

  return (
    <div className='h-[38px] w-full bg-main flex items-center justify-center'>
      <div className='w-main flex items-center justify-between text-xs text-white'>
        <span >ORDER ONLINE OR CALL US (+84)869-319-205</span>
        {isLoggedIn && current
          ? <div className='text-[13px] flex items-center justify-center gap-1 cursor-pointer'>
            <span>{`Wellcome, ${current?.firstname} ${current?.lastname} `}</span>
            <span
              onClick={() => dispatch(logout())}
              className='hover:rounded-full hover:bg-gray-200 hover:text-main p-2'>
              <IoIosLogOut size={15} />
            </span>
          </div>
          : <Link className='hover:text-gray-800' to={`/${path.LOGIN}`} >Sign in or Create Account</Link>
        }

      </div>
    </div>
  )
}

export default memo(TopHeader)