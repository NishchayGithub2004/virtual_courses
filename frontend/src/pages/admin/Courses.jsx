import React, { useEffect } from 'react' // import 'useEffect' hook to run side-effects
import { FaEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; // import 'useNavigate' hook to programmatically navigate b/w different pages
import { useDispatch, useSelector } from 'react-redux'; // import 'useDispatch' hook to send new values to redux states and 'useSelector' hook to access redux state variables
import axios from 'axios'; // import 'axios' library to make HTTP requests to the backend
import { serverUrl } from '../../App'; // import base URL to make backend requests to
import { toast } from 'react-toastify'; // import 'toast' component to render toast/pop-up messages
import { setCreatorCourseData } from '../../redux/courseSlice'; // import 'setCreatorCourseData' function from 'courseSlice' slice to set value of 'creatorCourseData' redux state
import img1 from "../../assets/empty.jpg"
import { FaArrowLeftLong } from "react-icons/fa6";

function Courses() { // create a functional component called 'Courses' to render UI to display all courses of a specific creator
  let navigate = useNavigate() // create an instance of 'useNavigate' hook to use it to programmatically navigate b/w different pages
  
  let dispatch = useDispatch() // create an instance of 'useDispatch' hook to use it to send new values to redux states
  
  const { creatorCourseData } = useSelector(state => state.course) // extract 'creatorCourseData' redux state from 'course' slice

  useEffect(() => {
    const getCreatorData = async () => { // create a function called 'getCreatorData' to get details of courses made by a creator
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreatorcourses", { withCredentials: true })
        // make a GET request to this backend URL to get courses made by a creator, send cookies with the request for user authentication so that only authorized users can make the request to the backend
        dispatch(setCreatorCourseData(result.data)) // set value of 'creatorCourseData' redux state to the data given by the backend as response
      } catch (error) { // if any error occurs while getting data of courses made by a creator
        console.log(error) // log the error to the console to know what error occurred
        toast.error(error.response.data.message) // render the error given by the backend as a toast/pop-up message
      }
    }

    getCreatorData()
  }, []) // run this function as a side-effect only once (when the component mounts)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-[100%] min-h-screen p-4 sm:p-6 bg-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <div className='flex items-center justify-center gap-3'>
            <FaArrowLeftLong
              className='w-[22px] h-[22px] cursor-pointer'
              onClick={() => navigate("/dashboard")} // clicking this button takes user to the dashboard
            />
            <h1 className="text-xl font-semibold">Courses</h1>
          </div>
          <button
            className="bg-[black] text-white px-4 py-2 rounded hover:bg-gray-500"
            onClick={() => navigate("/createcourses")} // clicking this page takes user to the page where a creator can create a new course
          >
            Create Course
          </button>
        </div>

        <div className="hidden md:block bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">Course</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {creatorCourseData?.map((course, index) => ( // iterate over 'creatorCourseData' array ie array of courses made by a creator
                <tr key={index} className="border-b hover:bg-gray-50 transition duration-200">
                  <td className="py-3 px-4 flex items-center gap-4">
                    {
                      course?.thumbnail // if a course's thumbnail is present, render it, otherwise render a fallback image
                        ? <img src={course?.thumbnail} alt="" className="w-25 h-14 object-cover rounded-md" />
                        : <img src={img1} alt='' className="w-14 h-14 object-cover rounded-md object-fit" />
                    }
                    <span>{course?.title}</span> {/* render course title */}
                  </td>

                  { // if a course's price is known, render it, else render 'NA
                    course?.price
                      ? <td className="py-3 px-4">₹{course?.price}</td>
                      : <td className="py-3 px-4">₹ NA</td>
                  }

                  {/* render whether the course is published or just in dract and apply styles as per it too */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${course?.isPublished ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}
                    >
                      {course?.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <FaEdit
                      className="text-gray-600 hover:text-blue-600 cursor-pointer"
                      onClick={() => navigate(`/addcourses/${course?._id}`)} // clicking this button takes user to the page where a creator can edit a course
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-center text-sm text-gray-400 mt-6">A list of your recent courses.</p>
        </div>
      </div>
    </div>
  )
}

export default Courses