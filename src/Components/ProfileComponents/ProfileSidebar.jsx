import React, { useEffect } from "react";
import { userContextProvider } from "../../Context/userContext";
import { useContext } from "react";
import { CgProfile } from "react-icons/cg";
import { SiNamebase } from "react-icons/si";
import { MdMarkEmailRead } from "react-icons/md";
import { IoIosSchool } from "react-icons/io";
import { FaImages } from "react-icons/fa6";
import { useState } from "react";
import "./ProfileSidebar.css";
import { useLocation } from "react-router-dom";
import { friendContextProvider } from "../../Context/friendContext";
import { PulseLoader } from "react-spinners";
import ProfileGraphVisualiser from "./ProfileGraphVisualiser";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import axios from "axios";
import { profileNavigatorContextProvider } from "../../Context/profileNavigatorContext";
import { statContextProvider } from "../../Context/statContext";
export default function ProfileSidebar() {
  const [loading, setIsLoadingState] = useState(false);
  const { user } = useContext(userContextProvider);
  const { userProfile, getUserProfile } = useContext(friendContextProvider);
  const [isSameUser, setIsSameUser] = useState(false);
  const [followers, setFollowers] = useState(
    userProfile?.followers?.length ?? 0
  );
  const [following, setFollowing] = useState(
    userProfile?.following?.length ?? 0
  );
  const [inChats, setInChats] = useState(true);
  const [communities, setCommunities] = useState(
    userProfile?.communities?.length ?? 0
  );
  const [isFollowing, setIsFollowing] = useState(
    userProfile ? userProfile.isfollowing : false
  );
  const { profileemail } = useParams();
  const location = useLocation();
  const { profileNavigator, setProfileNavigator } = useContext(
    profileNavigatorContextProvider
  );
  useEffect(() => {
    const miniUtilities = async () => {
      if (user?.email) {
        const userType = (await user.email) === profileemail;
        setIsSameUser(userType);
        getUserProfile(profileemail ? profileemail : user.email);
        setIsFollowing(userProfile?.isfollowing ?? false);
        setFollowers(userProfile?.followers?.length ?? 0);
        setFollowing(userProfile?.following.length ?? 0);
        setCommunities(userProfile?.communities?.length ?? 0);
        setInChats(userProfile?.recentChats?.includes(user._id));
      }
    };
    console.log(userProfile)
    miniUtilities();
  }, [location.pathname, user?.email, userProfile, isFollowing, profileemail]);
  const [editable, setEditable] = useState(false);
  const { getStats } = useContext(statContextProvider);
  useEffect(() => {
    getStats();
  }, []);
  const handleFollowBtn = async (e) => {
    e.preventDefault();
    setIsLoadingState(true);
    try {
      const response = (
        await axios.post(
          process.env.REACT_APP_BACKEND_URL + "/auth/updateFollowers",
          {
            masterAcc: userProfile.email,
            followerAcc: user.email,
            isFollowing: isFollowing,
          }
        )
      ).data;
      console.log(response);
      if (response.status) {
        setIsFollowing(!isFollowing);
        setIsLoadingState(false);
        toast.success("Refresh to update changes!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        toast.error("Try again later!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setIsLoadingState(false);
      }
    } catch (error) {
      toast.error("Try again later!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setIsLoadingState(false);
    }
  };
  const handledEditButton = async (e) => {
    e.preventDefault();
    try {
      if (editable === true) {
        setIsLoadingState(true);
        if (
          formData.username !== user.username ||
          formData.education !== user.education ||
          formData.dp !== user.dp
        ) {
          const response = await axios.post(
            process.env.REACT_APP_BACKEND_URL + "/auth/updateProfile",
            {
              email: user.email,
              username: formData.username.length
                ? formData.username
                : user.username,
              education: formData.education.length
                ? formData.education
                : user && user.education
                ? user.education
                : "Enthusiast at Nerd.net",
              dp: formData.dp.length ? formData.dp : user.dp,
            }
          );
          if (response.data.status) {
            toast.success("User details Updated successfully!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          } else {
            toast.error("Problem updating. Try later!", {
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
        } else {
          setEditable(false);
        }
        setIsLoadingState(false);
      }
    } catch (error) {
      toast.error("Error updating profile!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setIsLoadingState(false);
    }
    setEditable(!editable);
  };
  const [formData, setFormData] = useState({
    username: "",
    education: "",
    dp: "",
  });
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };
  const handleAddChat = async (friendId) => {
    try {
      const response = (
        await axios.post(
          process.env.REACT_APP_BACKEND_URL + "/chat/add-recent-chats",
          {
            userId: user._id,
            friendId: friendId,
          }
        )
      ).data;
      if (!response.status) {
        console.log(response);
      } else {
        console.log("error adding to chatlist")
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      id="profile-sidebar"
      className="flex flex-col items-center justify-start p-2"
    >
      <div
        id="profile-info-container"
        className="flex flex-col items-center justify-start w-full"
      >
        <div
          id="profile-dp-container"
          className="p-2 m-2 flex items-center justify-around w-full"
        >
          <img
            className="object-contain object-center rounded-full w-44 h-44"
            alt="dp"
            src={userProfile ? userProfile.dp : <CgProfile color="white" />}
          />
          <div>
            {isSameUser && editable ? (
              <form>
                <div className="flex items-center justify-start w-fit">
                  <SiNamebase
                    className="text-2xl"
                    color="white"
                    title="username"
                  />
                  <input
                    className={`text-lg font-bold mx-2 text-slate-500 inline-block outline-none w-fit`}
                    placeholder={`${user ? user.username : "Nerd"}`}
                    onChange={handleFormChange}
                    value={formData.username}
                    name="username"
                  />
                </div>
                <div className="flex items-center justify-start w-fit">
                  <MdMarkEmailRead
                    className="text-2xl"
                    color="#fff"
                    title="email"
                  />
                  <h6 className="text-lg font-bold mx-2 text-slate-500 inline-block w-fit">
                    {user ? user.email : "user@gmail.com"}
                  </h6>
                </div>
                <div className="flex items-center justify-start w-fit">
                  <IoIosSchool
                    className="text-2xl"
                    color="white"
                    title="education"
                  />
                  <input
                    className="text-lg font-bold mx-2 text-slate-500 inline-block outline-none w-fit"
                    placeholder={`${
                      user && user.education
                        ? user.education
                        : "Enthusiast at Nerd.net"
                    }`}
                    maxLength={23}
                    onChange={handleFormChange}
                    value={formData.education}
                    name="education"
                  />
                </div>
                <div className="flex items-center justify-start flex-wrap w-fit">
                  <FaImages className="text-2xl" color="white" title="dp" />
                  <input
                    className="text-lg font-bold mx-2 text-slate-500 inline-block outline-none w-fit"
                    placeholder={`Enter your dp`}
                    onChange={handleFormChange}
                    value={formData.dp}
                    name="dp"
                  />
                </div>
              </form>
            ) : (
              <div>
                <div className="flex items-center justify-start">
                  <SiNamebase
                    className="text-2xl"
                    color="white"
                    title="username"
                  />
                  <h5
                    className={`text-lg font-bold mx-2 text-slate-500 inline-block`}
                  >
                    {userProfile ? userProfile.username : "Nerd"}
                  </h5>
                </div>
                <div className="flex items-center justify-start">
                  <MdMarkEmailRead
                    className="text-2xl"
                    color="white"
                    title="email"
                  />
                  <h5 className="text-lg font-bold mx-2 text-slate-500 inline-block">
                    {userProfile ? userProfile.email : "user@gmail.com"}
                  </h5>
                </div>
                <div className="flex items-center justify-start">
                  <IoIosSchool
                    className="text-2xl"
                    color="white"
                    title="education"
                  />
                  <h5 className="text-lg font-bold mx-2 text-slate-500 inline-block">
                    {userProfile && userProfile.education
                      ? userProfile.education
                      : "Enthusiast at Nerd.net"}
                  </h5>
                </div>
              </div>
            )}
            <div className="flex items-center justify-around">
              {isSameUser ? (
                <button
                  type="button"
                  className="px-2 bg-sky-400 text-white rounded-lg m-2 flex items-center justify-center"
                  onClick={handledEditButton}
                >
                  {loading ? (
                    <PulseLoader className="scale-50" />
                  ) : editable ? (
                    "Save"
                  ) : (
                    "Edit"
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  className={`flex items-center justify-center px-2 bg-sky-400 text-white rounded-lg m-2 hover:bg-black hover:text-sky-400 trans300 ${
                    isFollowing ? " bg-slate-400 text-white opacity-60 " : " "
                  }`}
                  onClick={handleFollowBtn}
                >
                  {loading ? (
                    <PulseLoader className="scale-50" />
                  ) : isFollowing ? (
                    "UnFollow"
                  ) : (
                    "Follow"
                  )}
                </button>
              )}
              {isSameUser && editable && (
                <button
                  className="bg-black text-white rounded-lg m-2 hover:border-white trans300 hover:border-2 px-2"
                  onClick={() => {
                    setEditable(false);
                  }}
                >
                  Back
                </button>
              )}
              {!isSameUser && !inChats && (
                <button
                  onClick={() => {
                    handleAddChat(userProfile._id);
                  }}
                  className={`flex items-center justify-center px-2 bg-slate-400 text-white rounded-lg m-2 hover:bg-black hover:text-sky-400 trans300`}
                >
                  Add to Chats!
                </button>
              )}
            </div>
          </div>
        </div>
        <div
          id="profile-counts"
          className="flex items-center justify-around w-full m-2 text-white"
        >
          <div
            className="flex flex-col items-center justify-center cursor-pointer"
            onClick={() => {
              setProfileNavigator(profileNavigator == 1 ? 0 : 1);
            }}
          >
            <p>{followers}</p>
            <p className="text-xs">Followers</p>
          </div>
          <div
            className="w-1 h-6 rounded-2xl bg-black cursor-pointer"
            onClick={() => {}}
          ></div>
          <div
            className="flex flex-col items-center justify-center cursor-pointer"
            onClick={() => {
              setProfileNavigator(profileNavigator == 2 ? 0 : 2);
            }}
          >
            <p>{following}</p>
            <p className="text-xs">Following</p>
          </div>
          <div className="w-1 h-6 rounded-2xl bg-black"></div>
          <div
            className="flex flex-col items-center justify-center cursor-pointer"
            onClick={() => {
              setProfileNavigator(profileNavigator == 3 ? 0 : 3);
            }}
          >
            <p>{userProfile?.spaces?.length ?? 0}</p>
            <p className="text-xs">Communities</p>
          </div>
        </div>
        <ProfileGraphVisualiser />
      </div>
    </div>
  );
}
