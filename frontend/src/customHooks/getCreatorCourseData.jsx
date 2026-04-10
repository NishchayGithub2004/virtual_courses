import { useEffect } from "react"; // import 'useEffect' hook to run side-effects in functional components
import { useDispatch } from "react-redux"; // import 'useDispatch' hook from 'react-redux' library to dispatch actions to redux store to modify value of state variables
import { serverUrl } from "../App"; // import base URL to make backend requests to
import { setCreatorCourseData } from "../redux/courseSlice"; // import 'setCreatorCourseData' reducer from 'courseSlice' slice to update value of state variable 'creatorCourseData'
import axios from "axios"; // import 'axios' library to make HTTP requests to backend

const getCreatorCourseData = () => { // create a custom hook called 'getCreatorCourseData' to fetch all courses published by the creator from the backend
  const dispatch = useDispatch(); // create an instance of 'useDispatch' hook to use it to dispatch actions to redux store to modify value of state variables

  useEffect(() => {
    const getCreatorData = async () => { // create a function called 'getCreatorData' to get all courses published by the creator from the backend
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreatorcourses", { withCredentials: true }); // make HTTP request to this backend URL to get all courses published by the creator
        // send cookies with the request for user authentication so that any unauthorized user cannot access the backend
        dispatch(setCreatorCourseData(result.data)); // dispatch data extracted from the backend using 'setCreatorCourseData' reducer to update value of state variable 'creatorCourseData'
      } catch (error) { // if any error occurs while fetching courses of a creator from the backend
        console.log(error); // log the error to the console to know what error occurred
      }
    };

    getCreatorData();
  }, []); // run this function as a side-effect only once (when the component it is used in is mounted)
};

export default getCreatorCourseData; // export this custom hook to be used in other parts of the application