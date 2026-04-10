import axios from 'axios' // import 'axios' library to make HTTP requests to the backend
import React, { useEffect, useState } from 'react' // import 'useState' hook to create and manage state variables and 'useEffect' hook to run side-effects
import { useDispatch, useSelector } from 'react-redux' // import 'useDispatch' hook to set new values of redux states and 'useSelector' hook to access redux states
import { useNavigate, useParams } from 'react-router-dom' // import 'useNavigate' hook to programmatically navigate b/w pages and 'useParams' hook to access URL parameters
import { serverUrl } from '../App' // import base URL to make backend requests to
import { FaArrowLeftLong } from "react-icons/fa6"
import img from "../assets/empty.jpg"
import Card from "../components/Card.jsx"
import { setSelectedCourseData } from '../redux/courseSlice' // import 'setSelectedCourseData' reducer from 'courseSlice' slice to set value of 'selectedCourseData' redux state
import { FaLock, FaPlayCircle } from "react-icons/fa"
import { toast } from 'react-toastify' // import 'toast' function to render toast/pop-up messages
import { FaStar } from "react-icons/fa6"

function ViewCourse() { // create a functional component called 'ViewCourse' to render UI displaying a course
  const { courseId } = useParams() // extract unique ID of the course from URL parameters using 'useParams' hook
  
  const dispatch = useDispatch() // create an instance of 'useDispatch' hook to use it to set new values of redux states
  
  const navigate = useNavigate() // create an instance of 'useNavigate' hook to use it to programmatically navigate b/w pages

  const { courseData, selectedCourseData } = useSelector(state => state.course) // extract 'courseData' and 'selectedCourseData' redux state from 'course' slice
  
  const { userData } = useSelector(state => state.user) // extract 'userData' redux state from 'user' slice
  
  const { lectureData } = useSelector(state => state.lecture) // extract 'lectureData' redux state from 'lecture' slice

  const [selectedLecture, setSelectedLecture] = useState(null) // create a state variable 'selectedLecture' to store data of selected lecture and function 'setSelectedLecture' to change it's value, it's initial value is null
  
  const [creatorData, setCreatorData] = useState(null) // create a state variable 'creatorData' to store data of course creator and function 'setSelectedLecture' to change it's value, it's initial value is null
  
  const [selectedCreatorCourse, setSelectedCreatorCourse] = useState([]) // create a state variable 'selectedCreatorCourse' to store data of selected course of creator and function 'setSelectedCreatorCourse' to change it's value, it's initial value is null
  
  const [isEnrolled, setIsEnrolled] = useState(false) // create a state variable 'isEnrolled' to know if user is enrolled in a course or not and function 'setIsEnrolled' to change it's value, it's initial value is false
  
  const [rating, setRating] = useState(0) // create a state variable 'rating' to store rating of a course given by user and function 'setRating' to change it's value, it's initial value is 0
  
  const [comment, setComment] = useState("") // create a state variable 'comment' to store comment given by user to a course and function 'setComment' to change it's value, it's initial value is empty string

  const handleReview = async () => { // create a function called 'handleReview' to handle reviews given by user to a course
    try {
      const result = await axios.post(serverUrl + "/api/review/givereview", { rating, comment, courseId }, { withCredentials: true })
      // make a POST request to this URL and send user's rating, comment, and unique ID of course user has rated, send cookies with the request for user authentication so that only authorized users can make this request

      toast.success("Review Added") // render a toast message that review was added
      
      setRating(0) // set value of 'rating' to 0 again
      
      setComment("") // set value of 'comment' to empty string again
    } catch (error) { // if any error occurs while handling review given by user to a course
      console.log(error) // log the error to the console to know what error occurred
      toast.error(error?.response?.data?.message || "Failed to add review") // render a toast/pop-up message displaying error message given by the backend
    }
  }

  const calculateAverageRating = (reviews) => { // create a function called 'calculateAverageRating' to calculate average of all ratings given to a couese, it takes all reviews given to a course as argument
    if (!reviews || reviews.length === 0) return 0 // if no reviews are given to a course, return 0
    const total = reviews.reduce((sum, review) => sum + review.rating, 0) // add all ratings given by users to a course
    return (total / reviews.length).toFixed(1) // return average of all the ratings fixed to 1 decimal digit
  }

  const avgRating = calculateAverageRating(selectedCourseData?.reviews) // calculate average of all ratings given to selected course

  const fetchCourseData = () => { // create a function called 'fetchCourseData' to fetch data of a course
    const matchedCourse = courseData.find(item => item._id === courseId) // find the course that is selected
    if (matchedCourse) dispatch(setSelectedCourseData(matchedCourse)) // if selected course is found, set value of 'selectedCourseData' redux state to data of course found using 'setSelectedCourseData' reducer
  }

  const checkEnrollment = () => { // create a function to check if user is enrolled in a course
    const verify = userData?.enrolledCourses?.some(c => { // iterate over the courses user is enrolled in
      const enrolledId = typeof c === 'string' ? c : c._id // determine the enrollment ID of the user
      return enrolledId?.toString() === courseId?.toString() // check if enrollment ID is the same as course ID
    })

    if (verify) setIsEnrolled(true) // if value of 'verify' is true ie user is enrolled in selected course, set value of 'isEnrolled' to true using 'setIsEnrolled' function
  }

  useEffect(() => {
    fetchCourseData()
    checkEnrollment()
  }, [courseId, courseData, lectureData]) // create a side-effect that calls 'fetchCourseData' to fetch data of selected course and 'checkEnrollment' to check if user is enrolled in selected course
  // this side-effect will run everytime value of unique ID of course or data of selected course or data of any lecture of selected course changes

  useEffect(() => {
    const getCreator = async () => { // create a function called 'getCreator' to get data of course creator
      if (selectedCourseData?.creator) { // if user is creator of selected course
        try {
          const result = await axios.post(`${serverUrl}/api/course/getcreator`, { userId: selectedCourseData.creator }, { withCredentials: true })
          // make a POST request to this URL and send unique ID of course creator to get details of creator, send cookies with the request for user authentication so that only authorized users can make this request
          setCreatorData(result.data) // set value of 'creatorData' to data found about the course creator using 'setCreatorData' function
        } catch (error) { // if any error occurs while getting details of course creator
          console.error("Error fetching creator: ", error) // log the error to the console to know what error occurred
        }
      }
    }

    getCreator()
  }, [selectedCourseData]) // run this function as a side-effect when value of 'selectedCourseData' changes ie some other course is selected

  useEffect(() => {
    if (creatorData?._id && courseData.length > 0) { // if course creator is available and has courses are also present
      // find the courses created by the course creator we have right now
      const creatorCourses = courseData.filter(
        (course) =>
          course.creator === creatorData._id &&
          course._id !== courseId
      )

      setSelectedCreatorCourse(creatorCourses) // set value of 'selectedCreatorCourse' to courses found created by current creator using 'setSelectedCreatorCourse' function
    }
  }, [creatorData, courseData]) // run this side-effect everytime value of 'creatorData' changes ie some other course creator is selected or 'courseData' changes ie some other course is selected

  const handleEnroll = async (courseId, userId) => { // create a function called 'handleEnroll' to enroll a user to a course, it takes unique ID of course to enroll user to and user to enroll in the course
    try {
      const orderData = await axios.post(serverUrl + "/api/payment/create-order", { courseId, userId }, { withCredentials: true })
      // make POST request to this URL and send course and user's unique ID with it to create payment order, send cookies with the request for user authentication so that only authenticated users make the request

      const options = { // provide the following configurations for payment of the course
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // unique ID of rayzorpay account to make payment to
        amount: orderData.data.amount, // amount to pay for the course
        currency: "INR", // payment will be done in indian rupees
        name: "Virtual Courses", // unique name of payment
        description: "Course Enrollment Payment", // unique description of payment
        order_id: orderData.data.id, // unique ID of order from the backend
        handler: async function (response) { // function to actually make the payment
          try {
            const verifyRes = await axios.post(serverUrl + "/api/payment/verify-payment", {...response, courseId, userId}, { withCredentials: true })
            // make POST request to this URL to verify payment, send payment response event and course and user's unique ID to the request, also send cookies for user authentication so that only authenticated users can make the payment
            setIsEnrolled(true) // set value of 'isEnrolled' to true when the payment is done
            toast.success(verifyRes.data.message) // render a toast/pop-up message showing success message given by the backend
          } catch (verifyError) { // if any error occurs while verifying payment
            toast.error("Payment verification failed.") // render a toast message that payment verification failed
            console.error("Verification Error:", verifyError) // log the error to the console to know what error occurred
          }
        },
      }

      const rzp = new window.Razorpay(options) // create rayzorpay window to make the payment with provided configurations
      
      rzp.open() // open the rayzorpay window created to make the payment 
    } catch (err) { // if any error occurs while making the payment
      toast.error("Something went wrong while enrolling.") // render a toast/pop-up message that payment failed
      console.error("Enroll Error:", err) // log the error to the console to know what error occurred
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 relative">
        <div className="flex flex-col md:flex-row gap-6 ">
          <div className="w-full md:w-1/2">
            <FaArrowLeftLong
              className='text-[black] w-[22px] h-[22px] cursor-pointer'
              onClick={() => navigate("/")} // clicking this icon takes user to home page
            />

            <img
              src={selectedCourseData?.thumbnail || img} // render selected course's thumbnail
              alt="Course Thumbnail"
              className="rounded-xl w-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-2 mt-[20px]">
            <h1 className="text-2xl font-bold">{selectedCourseData?.title}</h1> {/* render selected course's title */}

            <p className="text-gray-600">{selectedCourseData?.subTitle}</p> {/* render selected course's sub title */}

            <div className="flex items-start flex-col justify-between">
              <div className="text-yellow-500 font-medium">
                ⭐ {avgRating}{" "} {/* render averate rating of the course */}
                <span className="text-gray-500">
                  ({selectedCourseData?.reviews?.length || 0} reviews) {/* render number of reviews given to the course */}
                </span>
              </div>

              <div>
                <span className="text-lg font-semibold text-black">₹{selectedCourseData?.price}</span>{" "} {/* render selected course's price */}
              </div>
            </div>

            <ul className="text-sm text-gray-700 space-y-1 pt-2">
              <li>✅ 10+ hours of video content</li>
              <li>✅ Lifetime access to course materials</li>
            </ul>

            {!isEnrolled ? ( // if user is not enrolled in current course
              <button
                className="bg-[black] text-white px-6 py-2 rounded hover:bg-gray-700 mt-3"
                onClick={() => handleEnroll(courseId, userData?._id)} // clicking this button starts user's enrollment process in the course
              >
                Enroll Now
              </button>
            ) : (
              <button
                className="bg-green-200 text-green-600 px-6 py-2 rounded hover:bg-gray-100 hover:border mt-3"
                onClick={() => navigate(`/viewlecture/${courseId}`)} // clicking this button takes user to page where it can watch lectures of the course it is enrolled in
              >
                Watch Now
              </button>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">What You'll Learn</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>
              Learn {selectedCourseData?.category} from Beginning {/* render selected course's category (Web Development, AI-ML, etc.) */}
            </li>
          </ul>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-1 text-gray-800">Course Curriculum</h2>
            
            <p className="text-sm text-gray-500 mb-4">{selectedCourseData?.lectures?.length} Lectures</p> {/* render number of lectures present in selected course */}

            <div className="flex flex-col gap-3">
              {selectedCourseData?.lectures?.map((lecture, index) => ( // iterate over lectures of selected course
                <button
                  key={index}
                  disabled={!lecture.isPreviewFree} // disable this button is preview of this lecture is not free
                  onClick={() => { // clicking this button sets value of 'selectedLecture' to current lecture if it's preview is free
                    if (lecture.isPreviewFree) {
                      setSelectedLecture(lecture)
                    }
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left ${
                    lecture.isPreviewFree // apply styles based on whether current lecture is free for preview or not
                      ? "hover:bg-gray-100 cursor-pointer border-gray-300"
                      : "cursor-not-allowed opacity-60 border-gray-200"
                  } ${
                    selectedLecture?.lectureTitle === lecture.lectureTitle // apply styles based on whether title of selected lecture is same as current lecture
                      ? "bg-gray-100 border-gray-400"
                      : ""
                  }`}
                >
                  <span className="text-lg text-gray-700">{lecture.isPreviewFree ? <FaPlayCircle /> : <FaLock />}</span> {/* render icon based on whether free preview of current lecture is available or not */}
                  <span className="text-sm font-medium text-gray-800">{lecture.lectureTitle}</span> {/* render title of current lecture */}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white w-full md:w-3/5 p-6 shadow-lg border border-gray-200">
            <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-black flex items-center justify-center">
              {selectedLecture?.videoUrl ? ( // if selected lecture has a video, render it, otherwise render text telling user to select a preview lecture to watch
                <video
                  src={selectedLecture.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-sm">
                  Select a preview lecture to watch
                </span>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-1">{selectedLecture?.lectureTitle || "Lecture Title"}</h3> {/* render selected course's title or fallback message if not available */}

            <p className="text-gray-600 text-sm">{selectedCourseData?.title}</p> {/* render selected course's title */}
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-2">Write a Review</h2>

          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => ( // render 5 stars to give rating to the course
              <FaStar
                key={star} // index of star is it's unique identifier
                onClick={() => setRating(star)} // clicking a star calls 'setRating' function
                className={`cursor-pointer ${
                  star <= rating // render color of stars based on rating given the user to a course
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {/* render text field where user can write comments about the course */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment here..."
            className="w-full border border-gray-300 rounded-lg p-2"
            rows="3"
          />

          <button
            className="bg-black text-white mt-3 px-4 py-2 rounded hover:bg-gray-800"
            onClick={handleReview} // clicking this button calls 'handleReview' to handle reviews given by the user to the course
          >
            Submit Review
          </button>

          <div className="flex items-center gap-4 pt-6 border-t mt-6">
            <img
              src={creatorData?.photoUrl || img} // render course creator's profile picture
              alt="Instructor"
              className="w-16 h-16 rounded-full object-cover"
            />
            
            <div>
              {/* render course creator's name, description/bio and email address */}
              <h3 className="text-lg font-semibold">{creatorData?.name}</h3>
              <p className="text-sm text-gray-600">{creatorData?.description}</p>
              <p className="text-sm text-gray-600">{creatorData?.email}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className='text-xl font-semibold mb-2'>Other Published Courses by the Educator -</p>
            
            <div className='flex flex-wrap gap-6'>
              {selectedCreatorCourse?.map((item, index) => ( // iterate over courses created by a specific creator and render 'Card' component for each, 
              // index of each course is it's unique identifier and pass course details as props to render course details in the card
                <Card
                  key={index}
                  thumbnail={item.thumbnail}
                  title={item.title}
                  id={item._id}
                  price={item.price}
                  category={item.category}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewCourse;