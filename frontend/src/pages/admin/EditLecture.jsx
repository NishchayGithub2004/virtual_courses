import axios from 'axios'; // import 'axios' library to make HTTP requests to the backend
import React, { useState } from 'react'; // import 'useState' hook to create and manage state variables
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux'; // import 'useDispatch' hook to set new values of redux states and 'useSelector' hook to access redux states
import { useNavigate, useParams } from 'react-router-dom'; // import 'useNavigate' hook to programmatically navigate b/w pages and 'useParams' hook to access URL parameters
import { serverUrl } from '../../App'; // import base URL to make backend requests to
import { setLectureData } from '../../redux/lectureSlice'; // import 'setLectureData' reducer from 'lectureSlice' slice to update value of 'lectureData' redux state
import { toast } from 'react-toastify'; // import 'toast' component to render toast/pop-up messages
import { ClipLoader } from 'react-spinners'; // import 'ClipLoader' component to render loading spinner

function EditLecture() { // create a functional component called 'EditLecture' to render UI to edit lecture data
  const [loading, setLoading] = useState(false); // create a state variable 'loading' to know whether to render a loading spinner or not and a function 'setLoading' to update it's value, it's initial value is false
  
  const [loading1, setLoading1] = useState(false); // same as above
  
  const [videoUrl, setVideoUrl] = useState(null); // create a state variable 'videoUrl' to store URL of the video and a function 'setVideoUrl' to update it's value, it's initial value is null

  const { courseId, lectureId } = useParams(); // extract unique ID of course and lecture from URL parameters
  
  const { lectureData } = useSelector(state => state.lecture); // extract 'lectureData' redux state from 'lecture' slice
  
  const dispatch = useDispatch(); // create an instance of 'useDispatch' hook to use it to set new values of redux state
  
  const navigate = useNavigate(); // create an instance of 'useNavigate' hook to use it to programmatically navigate b/w different pages

  const selectedLecture = lectureData.find(lecture => lecture._id === lectureId); // find lecture with matching ID as the one from URL parameters from 'lectureData' state 

  const [lectureTitle, setLectureTitle] = useState(selectedLecture?.lectureTitle || ""); // create a state variable 'lectureTitle' to store title of the lecture and a function'setLectureTitle' to update it's value, it's initial value is the title of the selected lecture or an empty string if no lecture is selected
  
  const [isPreviewFree, setIsPreviewFree] = useState(false); // create a state variable 'isPreviewFree' to know whether the lecture is free to watch as preview or not and a function 'setIsPreviewFree' to update it's value, it's initial value is false

  const editLecture = async () => { // create a function called 'editLecture' to update lecture data
    setLoading(true); // set value of 'loading' to true to render loading spinner

    const formData = new FormData(); // create an instance of 'FormData' class to send lecture data to backend in form format
    
    // append lecture data to 'formData' object
    formData.append("lectureTitle", lectureTitle);
    formData.append("videoUrl", videoUrl);
    formData.append("isPreviewFree", isPreviewFree);
    
    try {
      const result = await axios.post(serverUrl + `/api/course/editlecture/${lectureId}`, formData, { withCredentials: true });
      // send lecture data in 'formData' format as POST request to this backend URL alongwith cookies so that only authenticated users can make this request
      
      dispatch(setLectureData([...lectureData, result.data])); // update 'lectureData' redux state by appending new lecture data to it using 'setLectureData' function
      
      toast.success("Lecture Updated"); // render a toast/pop-up message that lecture has been updated successfully
      
      navigate("/courses"); // take user to courses page
    } catch (error) { // if any error occurs while editing lecture data
      console.log(error); // log the error to the console to know what error occurred
      toast.error(error.response.data.message); // render a toast/pop-up containing error message that comes from the backend
    } finally {
      setLoading(false); // finally set value of 'loading' to false to stop rendering loading spinner
    }
  };

  const removeLecture = async () => { // create a function called 'removeLecture' to remove lecture data
    setLoading1(true); // set value of 'loading1' to true to render loading spinner
    
    try {
      await axios.delete( serverUrl + `/api/course/removelecture/${lectureId}`, { withCredentials: true });
      // send a DELETE request to this backend URL alongwith cookies so that only authenticated users can make this request
      toast.success("Lecture Removed"); // render a toast/pop-up message that lecture has been removed successfully
      navigate(`/createlecture/${courseId}`); // take user to create lecture page for a specific course
    } catch (error) { // if any error occurs while removing lecture data
      console.log(error); // log the error to the console to know what error occurred
      toast.error("Lecture remove error"); // render a toast/pop-up containing error message
    } finally {
      setLoading1(false); // finally set value of 'loading1' to false to stop rendering loading spinner
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <FaArrowLeft
            className="text-gray-600 cursor-pointer"
            onClick={() => navigate(`/createlecture/${courseId}`)} // clicking this icon takes user to create lecture page for a specific course
          />
          <h2 className="text-xl font-semibold text-gray-800">Update Your Lecture</h2>
        </div>
        
        <div>
          <button
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all text-sm"
            disabled={loading1} // disable this button if value of 'loading1' is true
            onClick={removeLecture} // clicking this button calls 'removeLecture' function
          >
            {loading1 ? <ClipLoader size={30} color='white' /> : "Remove Lecture"} {/* if value of 'loading1' is true then render loading spinner else render text "Remove Lecture" */}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[black] focus:outline-none"
              placeholder={selectedLecture?.lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              value={lectureTitle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video *</label>
            <input
              type="file"
              required
              accept='video/*'
              className="w-full border border-gray-300 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-700 file:text-[white] hover:file:bg-gray-500"
              onChange={(e) => setVideoUrl(e.target.files[0])}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="accent-[black] h-4 w-4"
              onChange={() => setIsPreviewFree(prev => !prev)}
            />
            <label htmlFor="isFree" className="text-sm text-gray-700">Is this video FREE</label>
          </div>
        </div>
        
        <div>{loading ? <p>Uploading video... Please wait.</p> : ""}</div> {/* render a text if value of 'loading' is true, else nothing */}

        <div className="pt-4">
          <button
            className="w-full bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gray-700 transition"
            disabled={loading} // disable this button if value of 'loading' is true
            onClick={editLecture} // clicking this button calls 'editLecture' function
          >
            {loading ? <ClipLoader size={30} color='white' /> : "Update Lecture"} {/* if value of 'loading' is true then render loading spinner else render text "Update Lecture" */}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditLecture