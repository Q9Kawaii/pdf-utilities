import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className='px-7 flex justify-center text-center font-extrabold text-3xl md:text-4xl  items-center h-[100px]'>
      <h1><Link href={"/"}>PDF <span className='bg-indigo-600 px-2 py-1 rounded' >Utils</span></Link></h1>
    </div>
  )
}

export default Navbar
