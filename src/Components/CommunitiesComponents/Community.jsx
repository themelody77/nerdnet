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
  const [questionsForm, setQuestionsForm] = useState({
    community : props.community_id,
    name: "",
    questions: [
      {
        question: "",
        options: [
          { value: "", text: "" },
          { value: "", text: "" },
          { value: "", text: "" },
          { value: "", text: "" },
        ],
        ans: "",
      },
    ],
  });

  const handleInputChange = (index, field, value, optIndex) => {
    const updatedQuestions = [...questionsForm.questions];
    if (field === "option") {
      updatedQuestions[index].options[optIndex].text = value;
    } else {
      updatedQuestions[index][field] = value;
    }
    setQuestionsForm({ ...questionsForm, questions: updatedQuestions });
  };

  const addQuestion = () => {
    if (questionsForm.questions.length < 5) {
      // Limit to 5 questions
      setQuestionsForm({
        ...questionsForm,
        questions: [
          ...questionsForm.questions,
          {
            question: "",
            options: [
              { value: "", text: "" },
              { value: "", text: "" },
              { value: "", text: "" },
              { value: "", text: "" },
            ],
            ans: "",
          },
        ],
      });
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Validate that all questions are filled out
    const isFormValid = questionsForm.questions.every(
      (question) =>
        question.question && // Ensure question is not empty
        question.options.every((option) => option.text) && // Ensure all option texts are filled
        question.ans // Ensure answer is provided
    );

    if (!isFormValid) {
      alert("Please fill out all questions, options, and answers.");
      return;
    }
    try {
      const response = (await axios.post(process.env.REACT_APP_BACKEND_URL+"/assessments/create-assessment",questionsForm)).data;
      if(response.status){
        toast.success('Assingment added!', {
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
        toast.error("Error creating test", {
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
    } catch (error) {
      toast.error("Error creating test", {
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

    // Reset the form after submission
    setQuestionsForm({
      name: "",
      community : props.community_id,
      questions: [
        {
          question: "",
          options: [
            { text: "" },
            { text: "" },
            { text: "" },
            { text: "" },
          ],
          ans: "",
        },
      ],
    });
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
    <div className="community-aside p-2 w-fit flex items-center justify-start flex-col overflow-y-scroll text-white">
      <h2 className="w-full text-center">Create Quiz</h2>
      <form onSubmit={handleSubmit} className="test-form">
        <input
          type="text"
          value={questionsForm.name}
          onChange={(e) =>
            setQuestionsForm({ ...questionsForm, name: e.target.value })
          }
          className="bg-white text-black font-bold"
          placeholder="Enter assessment name"
          required
        />
        {questionsForm.questions.map((question, index) => (
          <div key={index}>
            <input
              type="text"
              value={question.question}
              onChange={(e) =>
                handleInputChange(index, "question", e.target.value)
              }
              placeholder={`Enter question ${index + 1}`}
              className="bg-white text-black font-bold"
              required
            />
            {[0, 1, 2, 3].map((optIndex) => (
              <input
                key={optIndex}
                type="text"
                value={question.options[optIndex].text}
                onChange={(e) =>
                  handleInputChange(index, "option", e.target.value, optIndex)
                }
                placeholder={`Enter option ${optIndex + 1}`}
                className="bg-white text-black font-bold"
                required
              />
            ))}
            <input
              type="text"
              value={question.ans}
              onChange={(e) => handleInputChange(index, "ans", e.target.value)}
              placeholder={`Enter answer for question ${index + 1}`}
              className="bg-white text-black font-bold"
              required
            />
          </div>
        ))}
        <div className="w-full flex items-center justify-around my-2">
          {questionsForm.questions.length < 5 && (
            <button
              className="bg-white trans100 text-black rounded-md hover:scale-90 mx-1"
              type="button"
              onClick={addQuestion}
            >
              Add Question
            </button>
          )}
          <button
            className="bg-yellow-400 trans100 text-black rounded-md hover:scale-90 mx-1"
            type="submit"
          >
            Create Quiz
          </button>
          <button className="bg-white trans100 text-black rounded-md hover:scale-90 mx-1" onClick={()=>{setNavIndex(0)}}>Back</button>
        </div>
      </form>
    </div>
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
  const [score, setScore] = useState(0);
  const [assignmentData,setAssignmentData] = useState(null);
  const [communityData,setCommunityData] = useState({});
  const [showTest,setShowTest] = useState(false);
  useEffect(() => {
    const GetCommunityPosts = async () => {
      try {
        socket.emit(
          "get-community-details",
          {
            id: community_id,
          },
          (response) => {
            console.log(response)
            if (response.status) {
              setCommunityPosts(response.community_info.posts);
              setCommunityData(response.community_info);
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
  const fetchTestData = async(test_id)=>{
    try {
      const response = (await axios.post(process.env.REACT_APP_BACKEND_URL+"/assessments/get-assessment",{
        assessment_id : test_id
      })).data;
      if(response.status){
        setAssignmentData(response.assessment);
      }
      else{
        toast.error("Error Getting Test data!", {
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
    } catch (error) {
      console.log(error);
      toast.error("Error Getting Test data!", {
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
  }
  const [contentReady, setContentReady] = useState(false);
  const [userSelections, setUserSelections] = useState(Array(assignmentData?.questions?.length).fill('')); // Array to store user's selected options
  const handleSelectChange = (index, selectedValue) => {
    const updatedSelections = [...userSelections];
    updatedSelections[index] = selectedValue;
    setUserSelections(updatedSelections);
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    // Calculate the score based on user selections
    assignmentData?.questions?.forEach((q, index) => {
      if (userSelections[index] === q?.ans) { // Use strict equality (===) for comparison
        console.log(userSelections[index] === q?.ans)
        setScore(score+1);
        console.log('Score incremented:', score);
      }
      else{

      }
    });
    try {
      const response = (await axios.post(process.env.REACT_APP_BACKEND_URL+"/assessments/write-score",{
        user : user._id,
        assessment_id : assignmentData._id,
        score : score,
        outOf : assignmentData.questions.length
      })).data;
      if(response.status == true){
        toast.success(`You got ${score}/${assignmentData?.questions?.length??100}`, {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
      else{
        toast.error("Error updating test!", {
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
      
    } catch (error) {
      console.log(error);
      toast.error("Error submitting test!", {
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
  }
  return (
    <div className="w-screen h-screen">
      <Header />
      {isLoading && <Loading />}
      {isMobile ? <MiniNavBar /> : null}
      <div className="flex items-center justify-start">
        <CommunityDetailsBar community_id={community_id} />
        {showTest ? 
        assignmentData!=null && 
        <div className="flex flex-col text-white items-center justify-start flex-1">
          <h6 className="text-2xl text-white p-2 rounded-md">{assignmentData?.name}</h6>
          <div className="flex items-center justify-center flex-wrap w-1/2">
          {assignmentData?.questions?.map((q,i)=>(
            <div className="m-2 p-2 rounded-md bg-slate-500">
              <p className="text-xl">Q<sub>{i+1}</sub>- {q?.question}</p>
              <select className="bg-black text-white m-2 outline-none" onChange={(e) => handleSelectChange(i, e.target.value)}>
                {q?.options.map((opt,j)=>(
                  <option className="w-full">{opt?.text}</option>
                ))}
              </select>
            </div>
          ))}
          </div>
          <button className="bg-yellow-400 text-black outline-none p-2 rounded-lg" onClick={handleSubmit}>Submit</button>
        </div> : contentReady && isAFollower ? (
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
      {communityData?.assessments?.length && <div className="bg-red absolute top-0 bottom-0 my-auto right-0 test-scroller w-fit text-white flex flex-col items-center justify-start">
        <h6 className="text-lg">Latest Tests!</h6>
        {communityData.assessments.map((test,i)=>(
          <button onClick={()=>{setShowTest(true);fetchTestData(test._id)}} className="text-left w-full">{test.name}</button>
        ))}
      </div>}
    </div>
  );
}
