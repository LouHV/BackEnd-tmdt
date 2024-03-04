import React, { memo, useState } from 'react'
import { productInforTabs } from '../ultils/contants'

const activedStyles = ''
const notActivedStyles = ''

const ProductInformation = () => {
  const [activeTabs, setactiveTabs] = useState(1)
  return (
    <div>
      <div className='flex items-center gap-2 relative bottom-[-1px]'>
        {productInforTabs.map(el => (
          <span key={el.id}
            className={`p-2 px-4 ${activeTabs === el.id ? 'bg-white border border-b-0' : 'bg-gray-200'} cursor-pointer`}
            onClick={() => setactiveTabs(el.id)}
          >{el.name}</span>
        ))}
      </div>
      <div className='w-full h-[300px] border'>
        {productInforTabs.some(el => el.id === activeTabs) && productInforTabs.find(el => el.id === activeTabs)?.content}
      </div>
    </div>
  )
}

export default memo(ProductInformation)