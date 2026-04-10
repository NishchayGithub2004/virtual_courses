import React, { useState } from 'react' // import 'useState' hook to create and manage state variables
import logo from '../assets/logo.jpg'
import axios from 'axios' // import 'axios' library to make HTTP requests to the backend
import { serverUrl } from '../App' // import base URL to make backend requests to
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from 'react-router-dom' // import 'useNavigate' hook to programmatically navigate b/w pages
import { ClipLoader } from 'react-spinners' // import 'ClipLoader' component to render loading spinner
import { toast } from 'react-toastify' // import 'toast' function to render toast/pop-up messages
import { useDispatch } from 'react-redux' // import 'useDispatch' hook to set values of redux states
import { setUserData } from '../redux/userSlice' // import 'setUserData' reducer from 'userSlice' slice to change value of 'userData' redux state

function SignUp() { // create a functional component called 'SignUp' to render registeration page UI
    const [name, setName] = useState("") // create a variable 'name' to store user's name and function 'setName' to change it's value, it's initial value is empty string
    
    const [email, setEmail] = useState("") // create a variable 'email' to store user's email address and function 'setEmail' to change it's value, it's initial value is empty string
    
    const [password, setPassword] = useState("") // create a variable 'password' to store user's password and function 'setPassword' to change it's value, it's initial value is empty string
    
    const [role, setRole] = useState("student") // create a variable 'role' to store user's role and function 'setRole' to change it's value, it's initial value is 'student'
    
    let [show, setShow] = useState(false) // create a variable 'show' to know whether to show a UI or not and function 'setShow' to change it's value, it's initial value is false
    
    const [loading, setLoading] = useState(false) // create a variable 'loading' to know whether to render loading spinner or not and function 'setLoading' to change it's value, it's initial value is false

    const navigate = useNavigate() // create an instance of 'useNavigate' hook to programmatically navigate b/w different pages
    
    let dispatch = useDispatch() // create an instance of 'useDispatch' hook to update values of redux states

    const handleSignUp = async () => { // create a function called 'handleSignUp' to handle user registeration
        setLoading(true) // set value of 'loading' to true to render loading spinner

        try {
            const result = await axios.post(serverUrl + "/api/auth/signup", { name, email, password, role }, { withCredentials: true })
            // make POST request to this URL and send user's details like name, email, password and role to it along with cookies for user authentication so that only authorized users can make this request

            dispatch(setUserData(result.data)) // set value of 'userData' to details/data returned by the backend using 'setUserData' function
            navigate("/") // redirect user to home page
            toast.success("SignUp Successfully") // render a toast message that user registeration has been successful
            setLoading(false) // set value of 'loading' to false to stop rendering loading spinner
        } catch (error) { // if any error occurs while registering the new user
            console.log(error) // log the error to the console to know what error occurred
            setLoading(false) // set value of 'loading' to false to stop rendering loading spinner
            toast.error(error?.response?.data?.message || "Signup failed") // render error message returned by the backend as toast message or render a fallback message if not available
        }
    }

    return (
        <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3'>
            <form
                className='w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex'
                onSubmit={(e) => e.preventDefault()} // do some things before actually submitting the form
            >
                <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3 '>
                    <div>
                        <h1 className='font-semibold text-[black] text-2xl'>Let's get Started</h1>
                        <h2 className='text-[#999797] text-[18px]'>Create your account</h2>
                    </div>

                    {/* render input fields for user's name, email, password, and role (student or teacher) */}

                    <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
                        <label htmlFor="name" className='font-semibold'>Name</label>
                        <input
                            id='name'
                            type="text"
                            className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]'
                            placeholder='Your name'
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </div>

                    <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
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

                    <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative'>
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

                    <div className='flex md:w-[50%] w-[70%] items-center justify-between'>
                        <span
                            className={`px-[10px] py-[5px] border-[1px] border-[#e7e6e6] rounded-2xl cursor-pointer ${role === 'student' ? "border-black" : "border-[#646464]"}`}
                            onClick={() => setRole("student")} // clicking this text sets value of 'role' to 'student'
                        >
                            Student
                        </span>

                        <span
                            className={`px-[10px] py-[5px] border-[1px] border-[#e7e6e6] rounded-2xl cursor-pointer ${role === 'educator' ? "border-black" : "border-[#646464]"}`}
                            onClick={() => setRole("educator")} // clicking this text sets value of 'role' to 'educator'
                        >
                            Educator
                        </span>
                    </div>

                    <button
                        className='w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px]'
                        disabled={loading} // this button is disabled if value of 'loading' is true
                        onClick={handleSignUp} // clicking this button calls 'handleSignUp' function to register the user into the app
                    >
                        {loading ? <ClipLoader size={30} color='white' /> : "Sign Up"} {/* if value of 'loading' is true, render a loading spinner, otherwise render text 'Sign Up' */}
                    </button>

                    <div className='text-[#6f6f6f]'>
                        Already have an account?{" "}
                        <span
                            className='underline underline-offset-1 text-[black] cursor-pointer'
                            onClick={() => navigate("/login")} // clicking this button takes user to login page
                        >
                            Login
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

export default SignUp;
