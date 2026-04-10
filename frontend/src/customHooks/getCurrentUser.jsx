import { useEffect } from "react"; // import 'useEffect' hook to run side-effects in functional components
import { useDispatch } from "react-redux"; // import 'useDispatch' hook from 'react-redux' library to dispatch actions to redux store to modify value of state variables
import { serverUrl } from "../App"; // import base URL to make backend requests to
import { setUserData } from "../redux/userSlice"; // import 'setUserData' reducer from 'userSlice' slice to update value of state variable 'userData'
import axios from "axios"; // import 'axios' library to make HTTP requests to backend

const getCurrentUser = () => { // create a custom hook called 'getCurrentUser' to fetch user data from the backend
    let dispatch = useDispatch(); // create an instance of 'useDispatch' hook to use it to dispatch actions to redux store to modify value of state variables

    useEffect(() => {
        const fetchUser = async () => { // create a function called 'fetchUser' to get user data from the backend
            try {
                let result = await axios.get(serverUrl + "/api/user/currentuser", { withCredentials: true }); // make HTTP request to this backend URL to get user data
                // send cookies with the request for user authentication so that any unauthorized user cannot access the backend
                dispatch(setUserData(result.data)); // dispatch data extracted from the backend using 'setUserData' reducer to update value of state variable 'userData'
            } catch (error) { // if any error occurs while fetching user data from the backend
                console.log(error); // log the error to the console to know what error occurred
            }
        };

        fetchUser();
    }, []); // run this function as a side-effect only once (when the component it is used in is mounted)
};

export default getCurrentUser; // export this custom hook to be used in other parts of the application