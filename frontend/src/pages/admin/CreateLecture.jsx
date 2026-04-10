import axios from 'axios'; // import 'axios' library to make HTTP requests to the backend
import React, { useEffect, useState } from 'react' // import 'useEffect' hook to run side-effects and 'useState' hook to create and manage state variables
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom'; // import 'useNavigate' hook to programmatically navigate b/w different pages and 'useParams' hook to access and use URL parameters
import { toast } from 'react-toastify'; // import 'toast' component to render toast/pop-up messages
import { serverUrl } from '../../App'; // import base URL to make backend requests to
import { ClipLoader } from 'react-spinners'; // import 'ClipLoader' component to render loading spinner
import { useDispatch, useSelector } from 'react-redux'; // import 'useDispatch' hook to send new values to redux states and 'useSelector' hook to access redux states
import { setLectureData } from '../../redux/lectureSlice'; // import 'setLectureData' reducer from 'lectureSlice' slice to set value of 'lectureData' redux state

function CreateLecture() { // create a functional component called 'CreateLecture' to render UI showing lecture creation
  const navigate = useNavigate() // create an instance of 'useNavigate' hook to use it to programmatically navigate b/w different pages
  
  const { courseId } = useParams() // extract unique ID of course from URL parameters

  const [lectureTitle, setLectureTitle] = useState("") // create a state variable 'lectureTitle' to store title of the lecture and function 'setLectureTitle' to change it's value
  
  const [loading, setLoading] = useState(false) // create a state variable 'loading' to know whether to render loading spinner or not and function 'setLoading' to change it's value

  const dispatch = useDispatch() // create an instance of 'useDispatch' hook to use it to set new values of redux states
  
  const { lectureData } = useSelector(state => state.lecture) // extract 'lectureData' redux state from 'lecture' slice

  const createLectureHandler = async () => { // create a function called 'createLectureHandler' to create a new lecture for a course
    setLoading(true) // set value of 'loading' to true to render loading spinner

    try {
      const result = await axios.post(serverUrl + `/api/course/createlecture/${courseId}`, { lectureTitle }, { withCredentials: true })
      // make a POST request to this backend URL and send new lecture's title to it and send cookies with the request to ensure only authenticated users make the request
      dispatch(setLectureData([...lectureData, result.data.lecture])) // set value of 'lecture' property of 'lectureData' object to the new lecture title provided
      toast.success("Lecture Created") // render a toast/pop-up message that lecture has been created
      setLoading(false) // set value of 'loading' to false to stop rendering loading spinner
      setLectureTitle("") // clear the title of the lecture
    } catch (error) { // if any error occurs while creating a new lecture
      console.log(error) // log the error to the console to know what error occurred
      toast.error(error.response.data.message) // render a toast/pop-up message displaying error given by the backend
      setLoading(false) // set value of 'loading' to false to stop rendering loading spinner
    }
  }

  useEffect(() => {
    const getLecture = async () => { // create a function called 'getLecture' to get details of a lecture
      try {
        const result = await axios.get(serverUrl + `/api/course/getcourselecture/${courseId}`, { withCredentials: true })
        // make a GET request to this URL to get details of a lecture
        dispatch(setLectureData(result.data.lectures)) // set value of 'lectureData' to the response given by the backend using 'setLectureData' function
      } catch (error) { // if any error occurs while getting details of a lecture
        console.log(error) // log the error to the console to know what error occurred
        toast.error(error.response.data.message) // render a toast/pop-up message displaying error given by the backend
      }
    }
    
    getLecture()
  }, []) // execute this function as a side-effect only once (when the component mounts)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-2xl p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">Let’s Add a Lecture</h1>
          <p className="text-sm text-gray-500">Enter the title and add your video lectures to enhance your course content.</p>
        </div>

        <input
          type="text"
          placeholder="e.g. Introduction to Mern Stack"
          className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          onChange={(e) => setLectureTitle(e.target.value)}
          value={lectureTitle}
        />

        <div className="flex gap-4 mb-6">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm font-medium"
            onClick={() => navigate(`/addcourses/${courseId}`)} // clicking this button takes user to URL where courses can be added
          >
            <FaArrowLeft /> Back to Course
          </button>
          <button
            className="px-5 py-2 rounded-md bg-[black] text-white hover:bg-gray-600 transition-all text-sm font-medium shadow"
            disabled={loading} // disable this button if value of 'loading' is true
            onClick={createLectureHandler} // clicking this button calls 'createLectureHandler' function
          >
            {loading ? <ClipLoader size={30} color='white' /> : "Create Lecture"} {/* if value of 'loading' is true, render a loading spinner, otherwise render a text '+ Create Lecture' */}
          </button>
        </div>

        <div className="space-y-2">
          {lectureData.map((lecture, index) => ( // iterate over 'lectureData' array as 'lecture' with it's index working as it's unique identifier
            <div key={index} className="bg-gray-100 rounded-md flex justify-between items-center p-3 text-sm font-medium text-gray-700">
              <span>Lecture - {index + 1}: {lecture.lectureTitle}</span> {/* render lecture title */}
              <FaEdit
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => navigate(`/editlecture/${courseId}/${lecture._id}`)} // clicking this icon takes user to URL where lecture details can be edited
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CreateLecture