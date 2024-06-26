import React, { useContext, useEffect, useRef, useState } from "react";
import { userContextProvider } from "../../Context/userContext";
import "./Chat.css";
import { css } from "@emotion/css";
import ScrollToBottom from "react-scroll-to-bottom";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { SyncLoader } from "react-spinners";
import dateFormat from "dateformat";
import { Link } from "react-router-dom";
import ChatIcon from "../../assets/chat.png";
import { FaLink } from "react-icons/fa6";
import EmojiPicker from "emoji-picker-react";
import { MdEmojiEmotions } from "react-icons/md";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { socketContextProvider } from "../../Context/socketContext";
const emojis = ["\u2764\uFE0F", "\uD83D\uDC4D", "\uD83D\uDC4E", "\uD83D\uDE32"];
const ReactionOpener = ({ userType, messageId, user }) => {
  const { socket } = useContext(socketContextProvider);
  const ref = useRef(null);
  const isInView = useInView(ref);
  const handleEmojiClick = async (e) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "/chat/chat-reaction/",
        {
          messageId: messageId,
          reaction: e.target?.innerHTML,
          userId: user?._id,
        }
      ).data;
      if (response.status) {
        console.log("Success");
      } else {
        console.log("Failed to add reaction! ", response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <motion.div
      ref={ref}
      className={`${
        userType === true ? "bg-black" : "bg-slate-500"
      } flex items-center justify-around rounded-lg h-fit p-1 mx-1 self-end trans300`}
      initial="hidden"
      style={{
        scale: isInView ? 1 : 0.9,
      }}
    >
      {emojis.map((emoji, i) => (
        <div
          key={i}
          className={`${
            userType === true ? "bg-slate-500" : "bg-black"
          } bg-black w-6 h-6 rounded-full flex items-center justify-center hover:scale-125 mx-1 trans100`}
        >
          <p value={emoji} onClick={handleEmojiClick}>
            {emoji}
          </p>
        </div>
      ))}
    </motion.div>
  );
};
const Text = ({ message, user, client }) => {
  const { socket } = useContext(socketContextProvider);
  const formatDate = (date) => {
    return dateFormat(date, "mmmm dS, yyyy");
  };
  const [isHovered, setIsHovered] = useState(false);
  return message?.user === user?._id ? (
    <div
      className="self-end text-white message m-1 flex-wrap flex"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      {isHovered && (
        <ReactionOpener
          userType={message?.user == user?._id}
          messageId={message._id}
          user={user}
        />
      )}
      <div className="flex items-center justify-start msg-box flex-wrap p-2 bg-slate-500 rounded-lg flex-col message-container">
        {message.isUrl === true ? (
          <a
            title={`${
              process.env.REACT_APP_FRONTEND_HOST + "/" + message?.message
            }`}
            target="_blank"
            href={`${message?.message}`}
            className="flex-wrap flex items-center justify-center group-hover:scale-110 trans100"
          >
            Link
            <FaLink />
          </a>
        ) : (
          <p className="flex-wrap">{message.message}</p>
        )}
        <div className="time-stamp-holders">
          <p>{formatDate(message.timestamp)}</p>
        </div>
      </div>
      <Link to={"/profile/" + user?.email}>
        <img alt="dp" src={user?.dp} className="w-6 h-6 rounded-full mx-1" />
      </Link>
    </div>
  ) : (
    <div
      className="self-start text-white message m-1 flex-wrap flex"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <Link to={"/profile/" + client?.email}>
        <img alt="dp" src={client?.dp} className="w-6 h-6 rounded-full mx-1" />
      </Link>
      <div className="flex items-center justify-start msg-box flex-wrap p-2 bg-black rounded-lg flex-col group">
        {message.isUrl === true ? (
          <a
            title={`${
              process.env.REACT_APP_FRONTEND_HOST + "/" + message?.message
            }`}
            target="_blank"
            href={`${message?.message}`}
            className="flex-wrap flex items-center justify-center group-hover:scale-110 trans100"
          >
            Link
            <FaLink />
          </a>
        ) : (
          <p className="flex-wrap">{message.message}</p>
        )}
        <div className="time-stamp-holders">
          <p>{formatDate(message.timestamp)}</p>
        </div>
      </div>
      {isHovered && (
        <ReactionOpener
          userType={message?.user == user?._id}
          messageId={message._id}
          user={user}
        />
      )}
    </div>
  );
};
export default function Chat() {
  const { socket } = useContext(socketContextProvider);
  const [active, setActive] = useState(0);
  const { user } = useContext(userContextProvider);
  const [client, setClient] = useState(user);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setEmojiPicker] = useState(false);
  const users = [user?._id, client?._id].sort();
  const chatId = users[0] + users[1];
  const fetchChat = async () => {
    try {
      socket.emit("fetch-chat", {
        chatId: chatId,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const [trigger, setTrigger] = useState(false);
  useEffect(() => {
    console.log("fetch data socket - ");
    socket.on("fetched-data/" + chatId, (data) => {
      console.log("fetch event - ", data);
      if (data.status == true) {
        setMessages(data.data.chats);
      } else {
        setMessages([]);
      }
    });
  }, [user, client,trigger]);
  useEffect(() => {
    fetchChat();
  }, [client, user]);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    socket.emit("add-message", {
      chatId: chatId,
      userId: user._id,
      message: value,
    });
    setValue("");
    setLoading(false);
    setTrigger(!trigger);
  };
  const handleEmojiClick = async (emoji) => {
    setValue(value + emoji.emoji);
  };
  return (
    <div className="fixed bottom-2 left-2 m-2 cursor-pointer w-fit flex items-center justify-start">
      <div
        className="bg-white w-12 h-12 rounded-full flex items-center justify-center"
        onClick={() => {
          setActive(!active);
          setEmojiPicker(false);
        }}
        title={`${user?.following?.length + " friends"}`}
      >
        {!active ? (
          <div className="w-12 h-12">
            <img alt="chat-icon" src={ChatIcon} />
          </div>
        ) : (
          <div className="w-12 h-12 text-red-700 flex items-center justify-center font-extrabold text-2xl">
            X
          </div>
        )}
      </div>
      {active == 1 && (
        <div
          id="online-frnds-container"
          className="flex items-center justify-start"
        >
          {user &&
            user.recentChats &&
            user.recentChats.map((member, i) => (
              <div key={i} className="flex">
                <img
                  alt="dp"
                  src={member.dp}
                  className="w-12 h-12 rounded-full mx-1 bg-white p-1"
                  onClick={() => {
                    setClient(member);
                    setActive(2);
                    setEmojiPicker(false);
                  }}
                />
              </div>
            ))}
        </div>
      )}
      {active == 2 && (
        <div
          id="chat-box"
          className="bg-white m-2 border-2 border-black rounded-lg flex flex-col items-center justify-start trans300"
        >
          <div
            id="chat-header"
            className="h-fit bg-yellow-500 w-full flex items-center justify-between p-1"
          >
            <Link
              to={"/profile/" + client?.email}
              className="flex items-center justify-start mx-1 cursor-pointer"
            >
              <img alt="dp" src={client?.dp} className="w-8 aspect-square object-cover" />
              <div className="mx-1 flex flex-col items-start justify-center">
                <p className="font-bold text-md m-0 p-0">{client?.username}</p>
                <p className="text-xs m-0 p-0">{client?.education}</p>
              </div>
            </Link>
            <IoClose
              color="red"
              className="font-extrabold mx-1 text-2xl"
              onClick={() => {
                setActive(0);
              }}
            />
          </div>
          <div id="chat-scroller" className={`my-1 items-center`}>
            {messages && messages.length ? (
              messages?.map((message, i) => (
                <div key={i} className="flex w-full flex-col">
                  <Text message={message} user={user} client={client} />
                </div>
              ))
            ) : (
              <p className="font-medium text-slate-600">
                Your chat will appear here
              </p>
            )}
          </div>
          <form
            id="chat-controller"
            className="m-2 flex items-center justify-start"
          >
            {showEmojiPicker && (
              <div className="emoji-picker absolute flex scale-75 top-0 bottom-0 left-0 right-0 m-auto">
                <EmojiPicker
                  theme="dark"
                  onEmojiClick={handleEmojiClick}
                  width={350}
                  height={400}
                />
              </div>
            )}
            <MdEmojiEmotions
              className={`${
                showEmojiPicker ? " bg-slate-500 rounded-lg text-white " : "  "
              } text-2xl mx-2`}
              onClick={() => {
                setEmojiPicker(!showEmojiPicker);
              }}
            />
            <input
              type="text"
              className="border-b-2 border-black w-56"
              name="chatInput"
              placeholder="Enter message..."
              onChange={(e) => {
                setValue(e.target.value);
              }}
              value={value}
            />
            {loading ? (
              <div className="bg-black w-fit mx-1 p-2 rounded-lg flex items-center justify-center h-fit">
                <SyncLoader color="#fff" size={15} />
              </div>
            ) : (
              <button
                type="submit"
                onClick={handleSendMessage}
                className="mx-1 p-1 bg-yellow-500 text-white font-normal rounded-lg"
              >
                Send
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
