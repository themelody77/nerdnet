import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Home from '../../Pages/Home'
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaQuestion } from "react-icons/fa";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TokenValidity from '../../Utilities/TokenValidity';
import { useContext } from 'react';
import { userContextProvider } from '../../Context/userContext';
import "./Navbar.css";
import Explore from '../../Pages/Explore';
export default function MiniNavBar() {
  const {user,getUserDetails} = useContext(userContextProvider);
  const navigate = useNavigate();
  const location = useLocation();
  const [path,setPath] = useState(location.pathname);
  useEffect(
    ()=>{
      TokenValidity().then((res)=>{
        if(res!==true){
          navigate("/");
        }
      })
      getUserDetails();
    }
  ,[location.pathname]);
  return (
    <div id='header-nav-links-mini' className='fixed bottom-0 left-0 right-0 h-fit mx-auto mb-2 flex items-center justify-around bg-black p-1 px-2 md:p-2 rounded-full'>
        <Link className={`${path === "/home" ? "bg-[#1eb81e]" : ""} text-xl md:text-3xl rounded-lg text-white p-1`}to="/home"><FaHome/></Link>
        <Link className={`text-white mx-2 my-1 p-1 ${path === "/explore" ? "bg-[#1eb81e]" : ""} text-xl md:text-3xl rounded-lg`} to="/explore"><FaMagnifyingGlass color='white'/></Link>
        {/* look into it */}
        <Link className={`text-white mx-2 my-1 text-xl md:text-3xl p-1 ${path === "/postForm" ? " bg-[#1eb81e] rounded-lg " : ""}`} to="/postForm"><FaArrowUp /></Link>
        <Link className='text-white mx-2 my-1 text-xl md:text-3xl p-1' to={Home}><FaPeopleGroup /></Link>
        <Link className='text-white mx-2 my-1 text-xl md:text-3xl p-1' to={Home}><FaQuestion /></Link>
    </div>
  )
}
