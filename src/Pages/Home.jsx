import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Header from '../Partials/Header';
import MiniNavBar from '../Components/Navbar/MiniNavBar';
import HomeFeed from '../Components/Feed/HomeFeed';
import AddPostBtn from '../Components/AddPost/AddPostBtn';
import AsideBar from '../Partials/AsideBar';
import Chat from '../Components/ChatComponents/Chat';
import Loading from '../Components/LoadPage/Loading';
import { loaderContextProvider } from '../Context/loaderContext';
import TokenValidity from '../Utilities/TokenValidity';
import { useNavigate } from 'react-router-dom';
import "./Pages.css"
export default function Home(props) {
  const {isLoading} = useContext(loaderContextProvider);
  const [isMobile,setIsMobile] = useState(window.innerWidth<768);
    useEffect(
        ()=>{
            setIsMobile(window.innerWidth < 768);
        }
    ,[window]);
    const navigate = useNavigate();
    useEffect(
      ()=>{
        TokenValidity().then((res)=>{
          if(res !== true){
            navigate("/");
          }
        })
      }
    ,[]);
  return (
    <div id='home-page' className='overflow-y-hidden h-screen w-screen'>
      <Header />
      {isLoading && <Loading/>}
      {isMobile ? <MiniNavBar /> : null}
      <div className={`flex items-center ${isMobile ? " justify-center " : " justify-start "}`}>
        {isMobile ? null : <AsideBar />}
        <HomeFeed />
      </div>
      {isMobile ? null : <AddPostBtn />}
      <Chat/>
    </div>
  );
}