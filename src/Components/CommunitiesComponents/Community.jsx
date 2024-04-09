import React, { useCallback, useContext, useEffect, useState } from "react";
import "./Community.css";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../Partials/Header";
import Loading from "../LoadPage/Loading";
import MiniNavBar from "../Navbar/MiniNavBar";
import { loaderContextProvider } from "../../Context/loaderContext";
import { userContextProvider } from "../../Context/userContext";
import AddPostBtn from "../AddPost/AddPostBtn";
import Post from "../Post/Post";
import { socketContextProvider } from "../../Context/socketContext";
import { HashLoader } from "react-spinners";
import axios from "axios";
import { toast } from "react-toastify";
const CommunityDetailsBar = (props) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { socket } = useContext(socketContextProvider);
  const [communityInfo, setCommunityInfo] = useState({
    name: "Community",
    dp: "#",
    coverPic: "#",
    subject: "NerdNet",
    description: "A NerdNet Community",
    followers: [],
    posts: [],
  });
  const { user } = useContext(userContextProvider);
  const [founder, setFounder] = useState({});
  const [editMode, setEditMode] = useState(false);
  const path = useLocation();
  const [trigger, setTrigger] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [navIndex, setNavIndex] = useState(0);
  const handleCommunityEditChange = async (e) => {
    e.stopPropagation();
    setEditedCommunityData({
      ...editedCommunityData,
      [e.target.name]: e.target.value,
    });
  };
  const handleCommunityEditSubmit = async (e) => {
    try {
      const response = (
        await axios.post(
          process.env.REACT_APP_BACKEND_URL + "/community/edit-community-info",
          {
            dp: editedCommunityData.dp,
            coverPic: editedCommunityData.coverPic,
            description: editedCommunityData.description,
            community_id: props.community_id,
          }
        )
      ).data;
      if (response.status) {
        console.log("Community info edited");
        setEditedCommunityData({
          dp: "",
          coverPic: "",
          description: "",
        });
        toast.success("Community updated successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTrigger(!trigger);
      }
    } catch (error) {
      toast.error("Error updating data!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        socket.emit(
          "get-community-details",
          {
            id: props?.community_id,
          },
          (response) => {
            if (response.status) {
              setCommunityInfo(response?.community_info);
              setIsAdmin(communityInfo?.admins?.includes(user?._id));
            } else {
              console.log("error getting community data");
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchCommunityDetails();

    return () => {
      socket.off("get-community-details");
    };
  }, [path.pathname, trigger]);
  useEffect(() => {
    const getFounderDetails = async () => {
      try {
        socket.emit(
          "get-community-founder",
          {
            user: communityInfo.createdBy,
          },
          (founderData) => {
            if (founderData.status) {
              setFounder(founderData.user);
              setIsAdmin(communityInfo?.admins?.includes(user?._id));
            } else {
              setFounder({});
            }
          }
        );
      } catch (error) {
        console.log(error);
        setFounder({});
      }
    };
    getFounderDetails();
    return () => {
      socket.off("get-community-founder");
    };
  }, [communityInfo]);
  const FormDiv = () => {
    return (
      <div className="text-white flex items-center justify-center flex-col my-1 w-full">
        <p className="self-start bg-slate-500 rounded-lg p-1 text-xs">About</p>
        <div className="flex items-center justify-center">
          <h4 className="font-bold text-3xl w-fit">{communityInfo.name}</h4>
          <p className="mx-1 w-fit text-sm rounded-lg bg-yellow-400 text-black">
            #{communityInfo.subject}
          </p>
        </div>
        <p className="community-description flex items-center justify-center flex-wrap">
          {communityInfo.description}
        </p>
      </div>
    );
  };
  const MetricsDiv = () => {
    return (
      <div className="text-white flex flex-col items-center justify-center w-full my-1">
        <p className="self-start bg-slate-500 rounded-lg p-1 text-xs">
          Lifetime Metrics
        </p>
        <div className="flex items-center justify-around w-full p-2 flex-wrap">
          <p>{communityInfo?.likes ?? 10} Likes</p>
          <p>{communityInfo?.followers?.length ?? 7} Nerds</p>
          <p>{communityInfo?.posts?.length ?? 100} Posts</p>
          <p>
            Created on {new Date(communityInfo?.dateCreated).toLocaleString()}
          </p>
        </div>
      </div>
    );
  };
  const AdminsDiv = () => {
    return (
      <div className="text-white flex flex-col items-center justify-center w-full my-1">
        <p className="self-start bg-slate-500 rounded-lg p-1 text-xs">
          Created By
        </p>
        <Link
          to={"/profile/" + founder?.email ?? user?.email}
          className="flex items-center justify-start m-2"
        >
          <img
            src={
              founder?.dp ??
              "https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"
            }
            alt="dp"
            className="w-12 rounded-lg mx-1 aspect-square"
          />
          <div>
            <p className="font-bold">{founder?.username}</p>
            <p className="text-base text-slate-200">
              {founder?.education ?? "Enthusiast at NerdNet"}
            </p>
          </div>
        </Link>
      </div>
    );
  };
  const [editedCommunityData, setEditedCommunityData] = useState({
    dp: "",
    coverPic: "",
    description: "",
  });

const TestCreator = () => {
  // Initial state for the quiz form
  const [questionsForm, setQuestionsForm] = useState({
    name: '',
    questions: [
      {
        question: '',
        options: [{ value: '', text: '' }],
        ans: ''
      }
    ]
  });

  // Function to handle changes in the quiz form fields
  const handleInputChange = (index, field, value) => {
    const updatedQuestions = [...questionsForm.questions];
    if (field === 'option') {
      updatedQuestions[index].options[0].value = value;
    } else {
      updatedQuestions[index][field] = value;
    }
    setQuestionsForm({ ...questionsForm, questions: updatedQuestions });
  };

  // Function to add a new question to the quiz form
  const addQuestion = () => {
    setQuestionsForm({
      ...questionsForm,
      questions: [
        ...questionsForm.questions,
        {
          question: '',
          options: [{ value: '', text: '' }],
          ans: ''
        }
      ]
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(questionsForm); // You can process the form data here (e.g., save to database)
    // Reset the form after submission (optional)
    setQuestionsForm({
      name: '',
      questions: [
        {
          question: '',
          options: [{ value: '', text: '' }],
          ans: ''
        }
      ]
    });
  };

  return (
    <div className="community-aside p-2 w-fit flex items-center justify-start flex-col overflow-y-scroll text-white">
      <h2>Create Quiz</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Quiz Name:</label>
        <input
          type="text"
          id="name"
          value={questionsForm.name}
          onChange={(e) => handleInputChange(-1, 'name', e.target.value)}
        />
        {questionsForm.questions.map((question, index) => (
          <div key={index}>
            <label htmlFor={`question-${index}`}>Question {index + 1}:</label>
            <input
              type="text"
              id={`question-${index}`}
              value={question.question}
              onChange={(e) => handleInputChange(index, 'question', e.target.value)}
            />
            <label htmlFor={`option-${index}`}>Option:</label>
            <input
              type="text"
              id={`option-${index}`}
              value={question.options[0].text}
              onChange={(e) => handleInputChange(index, 'option', e.target.value)}
            />
            <label htmlFor={`ans-${index}`}>Correct Answer:</label>
            <input
              type="text"
              id={`ans-${index}`}
              value={question.ans}
              onChange={(e) => handleInputChange(index, 'ans', e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={addQuestion}>
          Add Question
        </button>
        <button type="submit">Create Quiz</button>
      </form>
    </div>
  );
};
  return navIndex == 0 ? (
    <div className="community-aside p-2 w-fit flex items-center justify-start flex-col overflow-y-scroll">
      <div className="img-holder flex items-end justify-end flex-col">
        <div className="community-cover p-1 rounded-lg bg-white opacity-60 hover:opacity-100">
          <img
            alt="cover"
            className="object-contain"
            src={communityInfo.coverPic}
          />
        </div>
        <div className="community-dp p-1 m-2 absolute bg-white rounded-full">
          <img
            className="rounded-full object-contain"
            alt="dp"
            src={communityInfo.dp}
          />
        </div>
      </div>
      <FormDiv />
      <MetricsDiv />
      <AdminsDiv />
      {isAdmin && (
        <div className="w-full">
          {editMode ? (
            <div className="flex flex-col items-center justify-start w-full">
              <div className="flex flex-col items-center justify-start flex-wrap m-2 w-full gap-2 text-white font-bold">
                <input
                  name="dp"
                  value={editedCommunityData.dp}
                  onChange={handleCommunityEditChange}
                  className="community-input outline-none bg-transparent trans100 w-full"
                  placeholder="Enter DP"
                  key={"dp-input"}
                />
                <input
                  name="coverPic"
                  value={editedCommunityData.coverPic}
                  onChange={handleCommunityEditChange}
                  className="community-input outline-none bg-transparent trans100 w-full"
                  placeholder="Enter cover pic"
                  key={"coverpic-input"}
                />
                <input
                  name="description"
                  value={editedCommunityData.description}
                  onChange={handleCommunityEditChange}
                  className="community-input bg-transparent trans100 w-full outline-none"
                  placeholder="Enter Description"
                  key={"description-input"}
                />
              </div>
              <div className="flex items-center justify-around w-full gap-2">
                <button
                  className={`rounded-lg hover:scale-90 trans100  w-20 bg-white text-black font-bold p-1 ${
                    editedCommunityData.dp.length ||
                    editedCommunityData.coverPic.length ||
                    editedCommunityData.description.length
                      ? " opacity-100 "
                      : " opacity-60 pointer-events-none "
                  }`}
                  disabled={
                    !(
                      editedCommunityData.dp.length ||
                      editedCommunityData.coverPic.length ||
                      editedCommunityData.description.length
                    )
                  }
                  onClick={handleCommunityEditSubmit}
                >
                  Save
                </button>
                <button
                  className="rounded-lg hover:scale-90 trans100  w-20 bg-white text-black font-bold p-1"
                  onClick={() => {
                    setEditMode(false);
                  }}
                >
                  Back
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <button
                className="rounded-lg hover:scale-90 trans100 w-20 bg-white text-black font-bold p-1"
                onClick={() => {
                  setEditMode(true);
                }}
              >
                Edit
              </button>
            </div>
          )}
          <div className="flex w-full items-center justify-start flex-col">
            <button
              onClick={() => {
                setNavIndex(navIndex == 1 ? 0 : 1);
              }}
              className="py-0 h-8 w-full bg-white rounded-md hover:scale-95 trans100 m-2"
            >
              Add Test
            </button>
            <button
              onClick={() => {
                setNavIndex(navIndex == 2 ? 0 : 2);
              }}
              className="py-0 h-8 bg-white rounded-md hover:scale-95 trans100 m-2 w-full"
            >
              Scores
            </button>
          </div>
        </div>
      )}
    </div>
  ) : navIndex == 1 ? (
    <TestCreator />
  ) : (
    <></>
  );
};
export default function Community() {
  const { community_id } = useParams();
  const { user } = useContext(userContextProvider);
  const { isLoading } = useContext(loaderContextProvider);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [isAFollower, setIsAFollower] = useState(false);
  const { socket } = useContext(socketContextProvider);
  useEffect(() => {
    const GetCommunityPosts = async () => {
      try {
        socket.emit(
          "get-community-details",
          {
            id: community_id,
          },
          (response) => {
            if (response.status) {
              setCommunityPosts(response.community_info.posts);
              setContentReady(true);
            } else {
              setCommunityPosts([]);
            }
          }
        );
      } catch (error) {
        console.log(error);
        setCommunityPosts([]);
        setContentReady(false);
      }
    };
    const hasSubscribed = async () => {
      try {
        socket.emit(
          "check-community-subscription",
          {
            community_id: community_id,
            user_id: user?._id,
          },
          (response) => {
            setIsAFollower(response?.subscriptionStatus ?? false);
          }
        );
      } catch (error) {
        console.log(error);
        setIsAFollower(false);
      }
    };
    hasSubscribed();
    GetCommunityPosts();

    return () => {
      socket.off("check-community-subscription");
      socket.off("get-community-details");
    };
  }, []);
  const [contentReady, setContentReady] = useState(false);
  return (
    <div className="w-screen h-screen">
      <Header />
      {isLoading && <Loading />}
      {isMobile ? <MiniNavBar /> : null}
      <div className="flex items-center justify-start">
        <CommunityDetailsBar community_id={community_id} />
        {contentReady && isAFollower ? (
          <div
            id="community-feed-scroller"
            className="flex-1 flex flex-col items-center justify-center"
          >
            {communityPosts?.map((post, i) => (
              <div key={i} className="my-2">
                <Post {...post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <HashLoader color="#fff" />
          </div>
        )}
      </div>
      <AddPostBtn />
    </div>
  );
}
