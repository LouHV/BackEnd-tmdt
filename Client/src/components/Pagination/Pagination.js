import React from 'react'
import usePagination from '../../hooks/usePagination'
import PagiItem from './PagiItem'
import { useSearchParams } from 'react-router-dom'

const Pagination = ({ totalCount }) => {
  // console.log('usePagination(66,2) :>> ', usePagination(132,4));
  
  const [params] = useSearchParams()
  const currentPage = +params.get('page')
  const pagination = usePagination(totalCount,currentPage)

  const range = () => {
    const currentPage = +params.get('page')
    const pageSize = +process.env.REACT_APP_PRODUCT_LIMIT || 10
    const start = ((currentPage - 1) * pageSize) + 1
    const end = Math.min(currentPage * pageSize, totalCount)
    return `${start} - ${end}`
  }

  return (
    <div className='flex w-main justify-between items-center'>
      {+params.get('page') &&
        <span>{`Show products  ${range()} of ${totalCount}`}</span>}

      {!+params.get('page') &&
        <span>{`Show products 1 - ${+process.env.REACT_APP_PRODUCT_LIMIT || 10} of ${totalCount}`}</span>}
      <div className='flex items-center'>
        {pagination?.map(el => (
          <PagiItem key={el}>
            {el}
          </PagiItem>
        ))}</div>
    </div>
  )
}

export default Pagination

