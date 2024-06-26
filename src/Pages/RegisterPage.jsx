import React, { useContext, useState } from 'react'
import IntroBg from "../assets/nerd-intro.png";
import IntroBgMobile from "../assets/nerd-intro-mobile.png";
import Register from '../Components/Signup/Register';
import { loaderContextProvider } from '../Context/loaderContext';
import Loading from '../Components/LoadPage/Loading';
export default function RegisterPage() {
  const [isMobile,setIsMobile] = useState(window.innerWidth <768);
  const {isLoading} = useContext(loaderContextProvider);
  return (
    <div id='registration-page' className='w-screen'>
      {isLoading && <Loading/>}
      <img src={isMobile ? IntroBgMobile : IntroBg} alt='Introbg'
        className='absolute -z-10 opacity-50 object-cover h-screen w-[100%] top-0 left-0'
      />
      <Register/>
    </div>
  )
}