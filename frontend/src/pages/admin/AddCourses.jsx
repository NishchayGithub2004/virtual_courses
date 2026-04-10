import React, { useEffect, useRef, useState } from 'react' // import the following hooks: 'useEffect' to run side-effects, 'useRef' to get direct access to a DOM element, and 'useState' to create and manage state variables
import img from "../../assets/empty.jpg"
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom'; // import the following hooks: 'useNavigate' to programmatically navigate b/w different pages and 'useParams' to access and use URL parameters
import { serverUrl } from '../../App'; // import the base URL of backend to make requests to
import { MdEdit } from "react-icons/md";
import axios from 'axios'; // import 'axios' library to make HTTP requests to the backend
import { toast } from 'react-toastify'; 
import { useDispatch, useSelector } from 'react-redux'; // import the following hooks: 'useDispatch' to dispatch new values to redux states and 'useSelector' to access redux states
import { ClipLoader } from 'react-spinners'; // import 'ClipLoader' component to render loading spinner
import { setCourseData } from '../../redux/courseSlice'; // import 'setCourseData' function from 'courseSlice' slice to dispatch new value of course data to redux state 'courseData'

function AddCourses() { // create a functional component called 'AddCourses' to render UI to add courses to the app
  const navigate = useNavigate() // create an instance of 'useNavigate' hook to programmatically navigate b/w different pages

  const { courseId } = useParams() // extract unique ID of the course from URL parameters using 'useParams' hook

  // use 'useState' hook to create and manage the following state variables and functions
  const [selectedCourse, setSelectedCourse] = useState(null) // 'selectedCourse' to store the course selected and 'setSelectedCourse' to change it's value, it's initial value is null
  const [title, setTitle] = useState("") // 'title' to store the title of the course and 'setTitle' to change it's value, it's initial value is empty string
  const [subTitle, setSubTitle] = useState("") // 'subTitle' to store the subtitle of the course and 'setSubTitle' to change it's value, it's initial value is empty string
  const [description, setDescription] = useState("") // 'description' to store the description of the course and 'setDescription' to change it's value, it's initial value is empty string
  const [category, setCategory] = useState("") // 'category' to store the category of the course and 'setCategory' to change it's value, it's initial value is empty string
  const [level, setLevel] = useState("") // 'level' to store the level of the course and 'setLevel' to change it's value, it's initial value is empty string
  const [price, setPrice] = useState("") // 'price' to store the price of the course and 'setPrice' to change it's value, it's initial value is empty string
  const [isPublished, setIsPublished] = useState(false) // 'isPublished' to store the published status of the course and 'setIsPublished' to change it's value, it's initial value is false
  const thumb = useRef() // create an instance of 'useRef' hook to use it to get direct access to a DOM element
  const [frontendImage, setFrontendImage] = useState(null) // 'frontendImage' to store the frontend image of the course and 'setFrontendImage' to change it's value, it's initial value is null
  const [backendImage, setBackendImage] = useState(null) // 'backendImage' to store the backend image of the course and 'setBackendImage' to change it's value, it's initial value is null
  let [loading, setLoading] = useState(false) // 'loading' to store the loading status of the course and render loading spinner while making requests to the backend and 'setLoading' to change it's value, it's initial value is false

  const dispatch = useDispatch() // create an instance of 'useDispatch' hook to use it to dispatch new values to redux states
  const { courseData } = useSelector(state => state.course) // extract 'courseData' from redux slice 'course' using 'useSelector' hook

  const getCourseById = async () => { // create a function called 'getCourseById' to get a course's details by it's unique ID
    try {
      const result = await axios.get(serverUrl + `/api/course/getcourse/${courseId}`, { withCredentials: true })
      // make backend request to the following backend URL to get a specific course's details by it's unique ID, send cookies with the request for user's authentication so that only authorized user can make the request
      setSelectedCourse(result.data) // set value of 'selectedCourse' to the details of the course found
    } catch (error) { // if any error occurs while fetching details of a course
      console.log(error) // log the error to the console to know what error occurred
    }
  }

  // create a side-effect that runs every time value of 'selectedCourse' changes ie some other course is selected
  // it changes values of state variables related to course's details to the details of the course selected
  // if no course is selected, set the values of these state variables to empty strings or fallback image
  useEffect(() => {
    if (selectedCourse) {
      setTitle(selectedCourse.title || "")
      setSubTitle(selectedCourse.subTitle || "")
      setDescription(selectedCourse.description || "")
      setCategory(selectedCourse.category || "")
      setLevel(selectedCourse.level || "")
      setPrice(selectedCourse.price || "")
      setFrontendImage(selectedCourse.thumbnail || img)
      setIsPublished(selectedCourse?.isPublished)
    }
  }, [selectedCourse])

  // create a side-effect that runs only once (as soon as the component mounts) that calls 'getCourseById' function to get details of a specific course by it's unique ID
  useEffect(() => {
    getCourseById()
  }, [])

  const handleThumbnail = (e) => { // create a function called 'handleThumbnail' to change thumbnail of the course, it takes an event object as argument
    const file = e.target.files[0] // get the file/thumbnail selected by the user
    setBackendImage(file) // set value of 'backendImage' to the selected file
    setFrontendImage(URL.createObjectURL(file)) // set value of 'frontendImage' to the URL of the selected file
  }

  const editCourseHandler = async () => { // create a function called 'editCourseHandler' to edit a course's details
    setLoading(true) // set value of 'loading' to true to show loading spinner while the backend does it's thing

    const formData = new FormData() // create an instance of 'FormData' to send course details to the backend

    // add the course details to the form to send it to the backend
    formData.append("title", title)
    formData.append("subTitle", subTitle)
    formData.append("description", description)
    formData.append("category", category)
    formData.append("level", level)
    formData.append("price", price)
    formData.append("thumbnail", backendImage)
    formData.append("isPublished", isPublished)

    try {
      const result = await axios.post(
        `${serverUrl}/api/course/editcourse/${courseId}`,
        formData,
        { withCredentials: true }
      ) // make a POST request to this backend URL and send the course details as form data along with cookies for user authentication so that only authorized user can make request to the backend

      const updatedCourse = result.data // get the updated course details from the backend response

      if (updatedCourse.isPublished) { // if the updated course is published
        const updatedCourses = courseData.map(c => // create a new array of courses by mapping over the existing 'courseData' array
          c._id === courseId ? updatedCourse : c // if the course's ID matches the updated course's ID, replace it with the updated course, otherwise keep the original course
        )

        if (!courseData.some(c => c._id === courseId)) updatedCourses.push(updatedCourse) // if the updated course is not found in the 'courseData' array, add it to the array

        dispatch(setCourseData(updatedCourses)) // set value of 'courseData' redux state with the updated courses data
      } else { // if the updated course is not published
        const filteredCourses = courseData.filter(c => c._id !== courseId) // create a new array of courses by filtering out the updated course from the 'courseData' array
        dispatch(setCourseData(filteredCourses)) // set the value of 'courseData' redux state to the filtered courses
      }

      navigate("/courses") // take user to the page showing all the courses present in the app
      
      toast.success("Course Updated") // render a toast/pop-up message that the course has been updated
    } catch (error) { // if any error occurs while editing course details
      console.log(error) // log the error to the console to know what error occurred
      toast.error(error.response?.data?.message || "Something went wrong") // rende a toast/pop-up message showing the error given by the backend or fallback message if none given
    } finally {
      setLoading(false) // finally set value of 'loading' to false since we have seen the result (success or failure)
    }
  }

  const removeCourse = async () => { // create a function to remove a course
    setLoading(true) // set value of 'loading' to true to show a loading spinner while the backend does it's thing

    try {
      await axios.delete(serverUrl + `/api/course/removecourse/${courseId}`, { withCredentials: true })
      // make a DELETE request to this backend URL and send cookies with the backend for user authentication so that only authenticated user can make this backend request
      
      toast.success("Course Deleted") // render a toast/pop-up message that course has been deleted successfully
      
      const filteredCourses = courseData.filter(c => c._id !== courseId) // create a new array of courses by filtering out the course that was just deleted
      
      dispatch(setCourseData(filteredCourses)) // set the value of 'courseData' redux state to the filtered courses
      
      navigate("/courses") // take user to the page showing all the courses present in the app
    } catch (error) { // if any error occurs while removing course
      console.log(error) // log the error to the console to know what error occurred
      toast.error(error.response.data.message) // render a toast/pop-up message showing the error given by the backend or fallback message if none given
    } finally {
      setLoading(false) // finally set value of 'loading' to false since we have seen the result (success or failure)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-center gap-[20px] md:justify-between flex-col md:flex-row mb-6 relative">
        <FaArrowLeftLong
          className='top-[-20%] md:top-[20%] absolute left-[0] md:left-[2%] w-[22px] h-[22px] cursor-pointer'
          onClick={() => navigate("/courses")} // clicking this icon takes user to 'courses' page
        />
        <h2 className="text-2xl font-semibold md:pl-[60px]">Add detail information regarding course</h2>
        <div className="space-x-2 space-y-2">
          <button
            className="bg-black text-white px-4 py-2 rounded-md"
            onClick={() => navigate(`/createlecture/${selectedCourse?._id}`)} // clicking this button takes user to the page where lecture can be created for a course
          >
            Go to lectures page
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-md">
        <h3 className="text-lg font-medium mb-4">Basic Course Information</h3>
        <div className="space-x-2 space-y-2">
          {
            !isPublished // if value of 'isPublished' is false ie the course is not published, render a button clicking which publishes the course by toggling value of 'isPublished', otherwise if course is published, render a button clicking which unpublishes the course by doing the same thing
              ? <button
                className="bg-green-100 text-green-600 px-4 py-2 rounded-md border-1"
                onClick={() => setIsPublished(prev => !prev)}
              >
                Click to Publish
              </button>
              : <button
                className="bg-red-100 text-red-600 px-4 py-2 rounded-md border-1"
                onClick={() => setIsPublished(prev => !prev)}
              >
                Click to UnPublish
              </button>
          }
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md"
            disabled={loading} // this button is disabled if value of 'loading' is true
            onClick={removeCourse} // clicking this button removes the course
          >
            {loading ? <ClipLoader size={30} color='white' /> : "Remove Course"} {/* render loading spinner if value of 'loading' is true, otherwise render the text 'Remove Course' */}
          </button>
        </div>

        <form
          className="space-y-6"
          onSubmit={(e) => e.preventDefault()} // submitting this form do things required to be done before submitting the form data instantly
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              placeholder="Course Title"
              className="w-full border px-4 py-2 rounded-md"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input
              type="text"
              placeholder="Subtitle"
              className="w-full border px-4 py-2 rounded-md"
              onChange={(e) => setSubTitle(e.target.value)}
              value={subTitle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Course description"
              className="w-full border px-4 py-2 rounded-md h-24 resize-none"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full border px-4 py-2 rounded-md bg-white"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option value="">Select Category</option>
                <option value="App Development">App Development</option>
                <option value="AI/ML">AI/ML</option>
                <option value="AI Tools">AI Tools</option>
                <option value="Data Science">Data Science</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="Ethical Hacking">Ethical Hacking</option>
                <option value="UI UX Designing">UI UX Designing</option>
                <option value="Web Development">Web Development</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Level</label>
              <select
                className="w-full border px-4 py-2 rounded-md bg-white"
                onChange={(e) => setLevel(e.target.value)}
                value={level}
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (INR)</label>
              <input
                type="number"
                placeholder="₹"
                className="w-full border px-4 py-2 rounded-md"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Thumbnail</label>
            <input
              type="file"
              ref={thumb}
              hidden
              className="w-full border px-4 py-2 rounded-md"
              onChange={handleThumbnail}
              accept='image/*'
            />
          </div>

          {/* render course image and edit icon, clicking either of them focuses on the image */}
          <div className='relative w-[300px] h-[170px]'>
            <img
              src={frontendImage}
              alt=""
              className='w-[100%] h-[100%] border-1 border-black rounded-[5px]'
              onClick={() => thumb.current.click()}
            />
            <MdEdit
              className='w-[20px] h-[20px] absolute top-2 right-2'
              onClick={() => thumb.current.click()}
            />
          </div>

          <div className='flex items-center justify-start gap-[15px]'>
            <button
              className='bg-[#e9e8e8] hover:bg-red-200 text-black border-1 border-black cursor-pointer px-4 py-2 rounded-md'
              onClick={() => navigate("/courses")} // clicking this button takes the user backend to the courses page
            >
              Cancel
            </button>
            <button
              className='bg-black text-white px-7 py-2 rounded-md hover:bg-gray-500 cursor-pointer'
              disabled={loading} // this button is disabled
              onClick={editCourseHandler} // clicking this button calls 'editCourseHandler' function
            >
              {loading ? <ClipLoader size={30} color='white' /> : "Save"} {/* render loading spinner if value of 'loading' is true, otherwise render the text 'Save' */}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCourses;