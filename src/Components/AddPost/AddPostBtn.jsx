import React from 'react'
import { FaPlus } from "react-icons/fa";
export default function AddPostBtn() {
  return (
    <div id='add-post-btn' className='absolute right-0 bottom-0 m-2 w-fit h-fit p-2 rounded-lg bg-white flex items-center justify-center shadow-md shadow-black cursor-pointer'>
      <FaPlus color='green' className='text-xl'/> Add post
    </div>
  )
}
