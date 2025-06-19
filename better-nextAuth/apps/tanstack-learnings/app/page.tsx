import WithoutTanstack from '@/components/WithoutTanstack'
import WithTanstack from '@/components/WithTanstack'
import React from 'react'

const Landing = () => {
  return (
    <div className='flex justify-around w-screen'>
      <WithoutTanstack/>
      <WithTanstack/>
    </div>
  )
}

export default Landing