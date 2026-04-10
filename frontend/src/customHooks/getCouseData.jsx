import { useEffect } from "react"; // import 'useEffect' hook to run side-effects in functional components
import { useDispatch } from "react-redux"; // import 'useDispatch' hook from 'react-redux' library to dispatch actions to redux store to modify value of state variables
import { serverUrl } from "../App"; // import base URL to make backend requests to
import { setCourseData } from "../redux/courseSlice.js"; // import 'setCourseData' reducer from 'courseSlice' slice to update value of state variable 'courseData'
import axios from "axios"; // import 'axios' library to make HTTP requests to backend

const getCouseData = () => { // create a custom hook called 'getCouseData' to fetch all published courses from the backend
  const dispatch = useDispatch(); // create an instance of 'useDispatch' hook to use it to dispatch actions to redux store to modify value of state variables

  useEffect(() => {
    const getAllPublishedCourse = async () => { // create a function called 'getAllPublishedCourse' to get all published courses from the backend
      // send cookies with the request for user authentication so that any unauthorized user cannot access the backend
      try {
        const result = await axios.get(serverUrl + "/api/course/getpublishedcoures", { withCredentials: true }); // make HTTP request to this backend URL to get all published courses
        dispatch(setCourseData(result.data)); // dispatch data extracted from the backend using 'setCourseData' reducer to update value of state variable 'courseData'
      } catch (error) { // if any error occurs while fetching reviews of a course from the backend
        console.log(error); // log the error to the console to know what error occurred
      }
    };

    getAllPublishedCourse();
  }, []); // run this function as a side-effect only once (when the component it is used in is mounted)
};

export default getCouseData; // export this custom hook to be used in other parts of the application