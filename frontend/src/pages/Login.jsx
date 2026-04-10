import React, { useState } from 'react' // import 'useState' hook to create and manage state variables
import logo from '../assets/logo.jpg'
import axios from 'axios' // import 'axios' library to make HTTP requests to the backend
import { serverUrl } from '../App' // import URL to make backend requests to
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from 'react-router-dom' // import 'useNavigate' hook to programmatically navigate b/w pages
import { toast } from 'react-toastify' // import 'toast' function to render toast/pop-up messages
import { ClipLoader } from 'react-spinners' // import 'ClipLoader' component to render loading spinner
import { useDispatch } from 'react-redux' // import 'useDispatch' hook to set new values of redux states
import { setUserData } from '../redux/userSlice' // import 'setUserData' reducer from 'userSlice' slice to change value of 'userData' redux state

function Login() { // create a functional component called 'Login' to render login page UI
    const [email, setEmail] = useState("") // create a variable 'email' to store user's email address and function 'setEmail' to change it's value, it's initial value is empty string
    
    const [password, setPassword] = useState("") // create a variable 'password' to store user's password and function 'setPassword' to change it's value, it's initial value is empty string
    
    let [show, setShow] = useState(false) // create a variable 'show' to know whether to display content or not and function 'setShow' to change it's value, it's initial value is false
    
    const [loading, setLoading] = useState(false) // create a variable 'loading' to know whether to display loading spinner or not and function 'setLoading' to change it's value, it's initial value is false

    const navigate = useNavigate() // create an instance of 'useNavigate' hook to use it to programmatically navigate b/w different pages

    let dispatch = useDispatch() // create an instance of 'useDispatch' hook to use it to set values of redux state

    const handleLogin = async () => { // create a function called 'handleLogin' to handle user login logic
        setLoading(true) // set value of 'loading' to true to show loading spinner

        try {
            const result = await axios.post(serverUrl + "/api/auth/login", { email, password }, { withCredentials: true })
            // make POST request to this URL and send email and password of user to check if it exists in database, send cookies with request for user authentication so that only authorized users can login
            
            dispatch(setUserData(result.data)) // set value of 'userData' to user's data returned by backend using 'setUserData' reducer
            navigate("/") // redirect user to home page
            setLoading(false) // set value of 'loading' to false to stop showing loading spinner
            toast.success("Login Successfully") // render a toast message that login was successful
        } catch (error) { // if any error occurs while login user
            console.log(error) // log the error to the console to know what error occurred
            setLoading(false) // set value of 'loading' to false to stop showing loading spinner
            toast.error(error.response.data.message) // render a toast message showing error message returned by the backend
        }
    }

    return (
        <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3'>
            <form
                className='w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex'
                onSubmit={(e) => e.preventDefault()} // do some things before actually submitting the form
            >
                <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-4 '>
                    <div>
                        <h1 className='font-semibold text-[black] text-2xl'>Welcome back</h1>
                        <h2 className='text-[#999797] text-[18px]'>Login to your account</h2>
                    </div>

                    {/* render input fields for user to enter email address and password */}

                    <div className='flex flex-col gap-1 w-[85%] items-start justify-center px-3'>
                        <label htmlFor="email" className='font-semibold'>Email</label>
                        <input
                            id='email'
                            type="text"
                            className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]'
                            placeholder='Your email'
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>

                    <div className='flex flex-col gap-1 w-[85%] items-start justify-center px-3 relative'>
                        <label htmlFor="password" className='font-semibold'>Password</label>
                        <input
                            id='password'
                            type={show ? "text" : "password"}
                            className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]'
                            placeholder='***********'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />

                        {!show && // if value of 'show' is false, render this icon clicking which toggles value of 'show' to true
                            <MdOutlineRemoveRedEye
                                className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]'
                                onClick={() => setShow(prev => !prev)}
                            />
                        }

                        {show && // if value of 'show' is true, render this icon clicking which toggles value of 'show' to false
                            <MdRemoveRedEye
                                className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]'
                                onClick={() => setShow(prev => !prev)}
                            />
                        }
                    </div>

                    <button
                        className='w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px]'
                        disabled={loading} // this button is disabled if value of 'loading' is true
                        onClick={handleLogin} // clicking this button calls 'handleLogin' function to log the user into the app
                    >
                        {loading ? <ClipLoader size={30} color='white' /> : "Login"} {/* if value of 'loading' is true, render loading spinner, otherwise render text 'Login' */}
                    </button>

                    <span
                        className='text-[13px] cursor-pointer text-[#585757]'
                        onClick={() => navigate("/forgotpassword")} // clicking this text takes user to page where it can reset the password
                    >
                        Forget your password?
                    </span>

                    <div className='text-[#6f6f6f]'>
                        Don't have an account?{" "}
                        <span
                            className='underline underline-offset-1 text-[black]'
                            onClick={() => navigate("/signup")} // clicking this text takes user to signup page to register into the app
                        >
                            Sign up
                        </span>
                    </div>
                </div>

                <div className='w-[50%] h-[100%] rounded-r-2xl bg-[black] md:flex items-center justify-center flex-col hidden'>
                    <img src={logo} className='w-30 shadow-2xl' alt="" />
                    <span className='text-[white] text-2xl'>VIRTUAL COURSES</span>
                </div>
            </form>
        </div>
    )
}

export default Login;
