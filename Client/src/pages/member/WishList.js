import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Product } from '../../components'

const WishList = () => {
  const { current } = useSelector(s => s.user)
  return (
    <div className='w-full relative px-4'>
      <header className='text-3xl py-4 border-b '>
        My wishlist
      </header>
      <div className='p-4 w-full grid grid-cols-3 gap-3'>
        {current?.wishlist?.map(el => (
          <div className='flex justify-center rounded-md border'>
            <div key={el.id}>
              <Product
                pid={el._id}
                productData={el}
                className='mt-3'
              />
              <div className='px-4'>
                <Button>Add to cart</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default WishList