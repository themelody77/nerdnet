import React, { useContext } from 'react'
import Header from '../Partials/Header'
import AddPostBtn from '../Components/AddPost/AddPostBtn'
import ProfileSidebar from '../Components/ProfileComponents/ProfileSidebar'
import UserPosts from '../Components/ProfileComponents/UserPosts'
import MiniNavBar from '../Components/Navbar/MiniNavBar'
import { useState,useEffect } from 'react'
import {profileNavigatorContextProvider} from '../Context/profileNavigatorContext'
import FollowersList from '../Components/ProfileComponents/FollowersList'
import FollowingList from '../Components/ProfileComponents/FollowingList'
import Chat from '../Components/ChatComponents/Chat'
import { loaderContextProvider } from '../Context/loaderContext'
import Loading from '../Components/LoadPage/Loading'
import CommunitiesList from '../Components/ProfileComponents/CommunitiesList'
import TokenValidity from '../Utilities/TokenValidity'
import { useNavigate } from 'react-router-dom'
export default function Profile() {
  const {isLoading} = useContext(loaderContextProvider);
  const [isMobile,setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(
    ()=>{
      setIsMobile(window.innerWidth <= 768);
    }
  ,[window.innerWidth]);
  const {profileNavigator} = useContext(profileNavigatorContextProvider);
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

    <div id='profile' className='overflow-y-hidden h-screen w-screen'>
      {isLoading && <Loading/>}
      <Header/>
        <div id="profile-container" className={`flex ${isMobile ? " flex-col " : " "} items-center justify-start z-0`}>
          <ProfileSidebar/>
          {profileNavigator === 0 ? <UserPosts/> : profileNavigator === 1 ? <FollowersList/> : profileNavigator == 3 ? <CommunitiesList/> : <FollowingList/>}
        </div>
      {isMobile ? <MiniNavBar/> : <></>}
      {isMobile ? <></> : <AddPostBtn/>}
      <Chat/>
    </div>
  )
}

