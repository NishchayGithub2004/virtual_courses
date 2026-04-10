import axios from 'axios'; // import 'axios' library to make HTTP requests to backend
import React, { useState } from 'react'; // import 'useState' hook to create and manage state variables
import { useNavigate } from 'react-router-dom'; // import 'useNavigate' hook to programmatically navigate b/w pages
import { ClipLoader } from 'react-spinners'; // import 'ClipLoader' component to show loading spinner
import { serverUrl } from '../App'; // import base URL of backend to make requests to
import { toast } from 'react-toastify'; // import 'toast' function to show toast/pop-up messages

function ForgotPassword() { // create a functional component called 'ForgotPassword' to render UI displaying forgot password form
  let navigate = useNavigate(); // create an instance of 'useNavigate' hook to use it to programmatically navigate b/w pages

  const [step, setStep] = useState(1); // create a state variable 'step' to know which step of forgot password process user is in and a function 'setStep' to change it's value, it's initial value is 1
  const [email, setEmail] = useState(""); // create a state variable 'email' to store user's email and a function 'setEmail' to change it's value, it's initial value is an empty string
  const [otp, setOtp] = useState(""); // create a state variable 'otp' to store user's OTP and a function 'setOtp' to change it's value, it's initial value is an empty string
  const [loading, setLoading] = useState(false); // create a state variable 'loading' to know whether to show loading spinner or not and a function 'setLoading' to change it's value, it's initial value is false
  const [newpassword, setNewPassword] = useState(""); // create a state variable 'newpassword' to store user's new password and a function 'setNewPassword' to change it's value, it's initial value is an empty string
  const [conPassword, setConpassword] = useState(""); // create a state variable 'conPassword' to store user's confirm password and a function 'setConpassword' to change it's value, it's initial value is an empty string

  const handleStep1 = async () => { // create a function called 'handleStep1' to send user's email to backend and send OTP to user's email
    setLoading(true); // set value of 'loading' state to 'true' to show loading spinner

    try {
      const result = await axios.post(`${serverUrl}/api/auth/sendotp`, { email }, { withCredentials: true });
      // make a POST request to this backend URL and send user's email to it and send cookies to the backend for user authentication so only authorized users can make this request
      setStep(2); // set value of 'step' state to 2 to show OTP verification form
      toast.success(result.data.message); // show toast message whatever backend sends as successful response
    } catch (error) { // if any error occurs while sending OTP
      toast.error(error.response.data.message); // show toast message whatever backend sends as error response
    } finally {
      setLoading(false); // finally set value of 'loading' state to 'false' to hide loading spinner
    }
  };

  const handleStep2 = async () => { // create a function called 'handleStep2' to send user's email and OTP to backend and verify OTP
    setLoading(true); // set value of 'loading' state to 'true' to show loading spinner

    try {
      const result = await axios.post(`${serverUrl}/api/auth/verifyotp`, { email, otp }, { withCredentials: true });
      // make a POST request to this backend URL and send user's email and OTP to it and send cookies to the backend for user authentication so only authorized users can make this request

      toast.success(result.data.message); // show toast message whatever backend sends as successful response
      setLoading(false); // set value of 'loading' state to 'false' to hide loading spinner
      setStep(3); // set value of'step' state to 3 to show reset password form
    } catch (error) { // if any error occurs while verifying OTP
      toast.error(error.response.data.message); // show toast message whatever backend sends as error response
      setLoading(false); // set value of 'loading' state to 'false' to hide loading spinner
    }
  };

  const handleStep3 = async () => { // create a function called 'handleStep3' to send user's email and new password to backend and reset user's password
    setLoading(true); // set value of 'loading' state to 'true' to show loading spinner

    try {
      if (newpassword !== conPassword) return toast.error("password does not match"); // if new password and confirm password don't match, show toast message that password does not match

      const result = await axios.post(`${serverUrl}/api/auth/resetpassword`, { email, password: newpassword }, { withCredentials: true });
      // make a POST request to this backend URL and send user's email and new password to it and send cookies to the backend for user authentication so only authorized users can make this request
      
      toast.success(result.data.message); // show toast message whatever backend sends as successful response
      setLoading(false); // set value of 'loading' state to 'false' to hide loading spinner
      navigate("/login"); // take user to login page
    } catch (error) { // if any error occurs while resetting password
      toast.error(error.response.data.message); // show toast message whatever backend sends as error response
      setLoading(false); // set value of 'loading' state to 'false' to hide loading spinner
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {step == 1 && ( // if user is at step 1 of forgot password, show UI for entering email
        <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Forgot Your Password?</h2>
  
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Enter your email address</label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
  
            <button
              type="submit"
              disabled={loading} // disable this button if value of 'loading' state is 'true'
              onClick={handleStep1} // clicking this button calls 'handleStep1' function
            >
              {loading ? <ClipLoader size={30} color="white" /> : "Send OTP"}
            </button>
          </form>
  
          <div onClick={() => navigate("/login")}> {/* clicking this button takes userr to login page */}
            Back to Login
          </div>
        </div>
      )}
  
      {step == 2 && ( // if user is at step 2 of forgot password, show UI for entering OTP
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Enter OTP</h2>
  
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Please enter the 4-digit code sent to your email.
              </label>
              <input
                type="text"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                required
              />
            </div>
  
            <button
              type="submit"
              disabled={loading} // disable this button if value of 'loading' state is 'true'
              onClick={handleStep2} // clicking this button calls 'handleStep2' function
            >
              {loading ? <ClipLoader size={30} color="white" /> : "Verify OTP"}
            </button>
          </form>
  
          <div onClick={() => navigate("/login")}> {/* clicking this button takes user to login page */}
            Back to Login
          </div>
        </div>
      )}
  
      {step == 3 && ( // if user is at step 3 of forgot password, show UI for resetting password
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Reset Your Password</h2>
  
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter a new password below to regain access to your account.
          </p>
  
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}> {/* do some things before actually submitting the form */}
            {/* render input fields for new password and confirm password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="text"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newpassword}
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="text"
                onChange={(e) => setConpassword(e.target.value)}
                value={conPassword}
              />
            </div>
  
            <button
              type="submit"
              onClick={handleStep3} // clicking this button calls 'handleStep3' function
            >
              {loading ? <ClipLoader size={30} color="white" /> : "Reset Password"} {/* if value of 'loading' state is 'true', show loading spinner, else show text "Reset Password" */}
            </button>
          </form>
  
          <div onClick={() => navigate("/login")}> {/* clicking this button takes user to login page */}
            Back to Login
          </div>
        </div>
      )}
    </div>
  );  
}

export default ForgotPassword;