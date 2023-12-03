import React from 'react'
import "./Register.css";
import SignUpAnimation from "../../assets/signUp.json";
import Lottie from 'lottie-react';
import { useState,useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import axios from 'axios';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function Register({data}) {
  const [formData,setFormData] = useState({
    username : '',
    email : "",
    password : "",
    repassword : "",
    dob : ""
  });
  const handleFormChange = (e)=>{
    const {name,value} = e.target;
    setFormData({...formData,[name]: value});
    console.log(formData);
  }
  const submitForm = (e)=>{
    e.preventDefault();
    if(!emailPattern.test(formData.email))
    {
      toast.error('Enter valid Email!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    else if(formData.password !== formData.repassword)
    {
      toast.error("Re-entered password didn't match!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    else{
      axios.post("/api/auth/createUser/",{
        username : formData.username,
        email : formData.email,
        password : formData.password,
        dob : formData.dob
      }).then((response)=>{
        console.log(response);
      }).catch((error)=>{
        console.log("error "+error);
      });
    }
  }
  const [formFilled,setFormFilled] = useState(0);
  useEffect(
    ()=>{
      const formDataChanged = ()=>{
        setFormFilled(((formData.username.length)&&(formData.email.length)&&(formData.password.length)&&(formData.repassword.length)&&(formData.dob.length)));
      }
      formDataChanged();
    }
  ,[formData]);
  return (
    <div id='registration-div' className='absolute top-0 left-0 bottom-0 right-0 m-auto bg-white flex flex-col items-center justify-center rounded-lg'>
      <h1 className='text-3xl font-semibold'>Register!</h1>
      <div id='register-info' className='flex flex-row-reverse items-center justify-around'>
          <form id='register-form' className='flex flex-col items-center justify-around flex-wrap'>
            <input className='outline-none register-inputs trans300 p-2 pb-0' type='text' placeholder='Enter username' required name='username' value={formData.username} onChange={handleFormChange}/>
            <input className='register-inputs outline-none trans300 p-2 pb-0' type='email' placeholder='Enter your Email' required name='email' value={formData.email} onChange={handleFormChange}/>
            <input className='register-inputs outline-none trans300 p-2 pb-0' type='password' placeholder='Enter password' required name='password' value={formData.password} onChange={handleFormChange}/>
            <input className='register-inputs outline-none trans300 p-2 pb-0' type='password' placeholder='Re-enter password' required name='repassword' value={formData.repassword} onChange={handleFormChange}/>
            <input className='register-inputs outline-none trans300 p-2 pb-0' type='date' placeholder='Enter DOB' required name='dob' value={formData.dob} onChange={handleFormChange}/>
            <button onClick={submitForm} disabled={!formFilled} type='submit' className={`text-black bg-yellow-400 p-1 rounded-lg w-24 border-2 border-black hover:bg-black hover:text-yellow-400 trans300 mt-2 ${formFilled ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}>SignUp</button>
          </form>
          {data.isMobile ? <></> : <div className='bg-slate-400 w-1 h-16 rounded-full' id='v-line'></div>}
          {data.isMobile?<></>:<div className='w-72'>
            <Lottie animationData={SignUpAnimation} loop={true}/>
          </div>}
      </div>
      {/* the css can be found in login.css */}
      <div id='semi-footer' className='flex w-[100%] items-center justify-around mt-4'>
        <a href='/' className='font-light text-gray-500 text-xs hover:underline'>About</a>
        <a href='/' className='font-light text-gray-500 text-xs hover:underline'>Privacy & Policy</a>
        <a href='/' className='font-light text-gray-500 text-xs hover:underline'>Revenue</a>
        <p className='font-light text-gray-500 text-xs'>&copy; Nerd.net {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}
const mapStateToProps = (state)=>{
  return {
    data : {
      isMobile : state.isMobile,
    }
  }
}
export default connect(mapStateToProps)(Register);