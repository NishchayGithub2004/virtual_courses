import { useEffect } from "react"; // import 'useEffect' hook to run side-effects in functional components
import { useDispatch } from "react-redux"; // import 'useDispatch' hook from 'react-redux' library to dispatch actions to redux store to modify value of state variables
import { serverUrl } from "../App"; // import base URL to make backend requests to
import { setAllReview } from "../redux/reviewSlice"; // import 'setAllReview' reducer from 'reviewSlice' slice to update value of state variable 'allReview'
import axios from "axios"; // import 'axios' library to make HTTP requests to backend

const getAllReviews = () => { // create a custom hook called 'getAllReviews' to fetch all reviews of a course from the backend
  const dispatch = useDispatch(); // create an instance of 'useDispatch' hook to use it to dispatch actions to redux store to modify value of state variables

  useEffect(() => {
    const getAllReviews = async () => { // create a function called 'getAllReviews' to get all reviews of a course from the backend
      try {
        const result = await axios.get(serverUrl + "/api/review/allReview", { withCredentials: true }); // make HTTP request to this backend URL to get all reviews of a course
        // send cookies with the request for user authentication so that any unauthorized user cannot access the backend
        dispatch(setAllReview(result.data)); // dispatch data extracted from the backend using 'setAllReview' reducer to update value of state variable 'allReview'
      } catch (error) { // if any error occurs while fetching reviews of a course from the backend
        console.log(error); // log the error to the console to know what error occurred
      }
    };

    getAllReviews();
  }, []); // run this function as a side-effect only once (when the component it is used in is mounted)
};

export default getAllReviews; // export this custom hook to be used in other parts of the application