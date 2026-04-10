import axios from 'axios'; // import 'axios' library to make HTTP requests to the backend
import React, { useState } from 'react'; // import 'useState' hook to create and manage state variables
import { useDispatch, useSelector } from 'react-redux'; // import 'useDispatch' hook to set new values of redux states and 'useSelector' hook to access redux states
import { serverUrl } from '../App'; // import base URL of backend to make requests to
import { setUserData } from '../redux/userSlice'; // import 'setUserData' reducer to set new value of 'userData' redux state
import { toast } from 'react-toastify'; // import 'toast' function to show toast/pop-up messages
import { ClipLoader } from 'react-spinners'; // import 'ClipLoader' component to show loading spinner
import { useNavigate } from 'react-router-dom'; // import 'useNavigate' hook to programmatically navigate b/w pages
import { FaArrowLeftLong } from "react-icons/fa6";

function EditProfile() { // create a functional component called 'EditProfile' to render UI displaying edit profile form
  let { userData } = useSelector(state => state.user); // extract 'userData' redux state from 'user' redux state

  let [name, setName] = useState(userData.name || ""); // create a state variable 'name' to store user's name and a function 'setName' to change it's value, it's initial value is user's name or an empty string if not available

  let [description, setDescription] = useState(userData.description || ""); // create a state variable 'description' to store user's description and a function 'setDescription' to change it's value, it's initial value is user's description or an empty string if not available

  let [photoUrl, setPhotoUrl] = useState(null); // create a state variable 'photoUrl' to store user's profile photo URL and a function 'setPhotoUrl' to change it's value, it's initial value is null
  
  let [loading, setLoading] = useState(false); // create a state variable 'loading' to know whether to show loading spinner or not and a function'setLoading' to change it's value, it's initial value is false
  
  let dispatch = useDispatch(); // create an instance of 'useDispatch' hook to use it to set new values of redux states
  
  let navigate = useNavigate(); // create an instance of 'useNavigate' hook to use it to programmatically navigate b/w pages

  const formData = new FormData(); // create an instance of 'FormData' class to send edited data to backend

  // add updated name, description and URL of profile photo to 'formData' object
  formData.append("name", name);
  formData.append("description", description);
  formData.append("photoUrl", photoUrl);

  const updateProfile = async () => { // create a function called 'updateProfile' to send edited data to backend and update user's profile
    setLoading(true); // set value of 'loading' state to 'true' to show loading spinner
    
    try {
      const result = await axios.post(serverUrl + "/api/user/updateprofile", formData, { withCredentials: true });
      // make a POST request to this backend URL and send edited data to it and send cookies to the backend for user authentication so only authorized users can make this request
      dispatch(setUserData(result.data)); // set value of 'userData' redux state to the updated user data returned by backend by 'setUserData' reducer
      navigate("/"); // take user to home page
      toast.success("Profile Update Successfully"); // show toast message that profile was updated successfully
    } catch (error) { // if any error occurs while updating profile
      toast.error("Profile Update Error"); // show toast message that profile update failed
    } finally {
      setLoading(false); // set value of 'loading' state to 'false' to hide loading spinner
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-4 sm:py-6">
      <div className="relative w-full max-w-xl rounded-2xl border border-[#CBD5E1] bg-white p-5 shadow-lg shadow-[#0F172A]/10 sm:p-6">
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="absolute left-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#2563EB] text-[#2563EB] transition-colors hover:bg-[#DBEAFE] sm:left-5 sm:top-5 sm:h-9 sm:w-9"
        >
          <FaArrowLeftLong className="h-4 w-4" />
        </button> {/* clicking this icon takes user back to profile page */}
        <h2 className="mb-5 text-center text-2xl font-bold text-[#0F172A] sm:mb-6">Edit Profile</h2>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4"> {/* do some things before actually submitting the form */}
          <div className="mb-1 flex flex-col items-center text-center">
            {userData.photoUrl // render user's profile photo if available, otherwise render initials of user's name
              ? <img src={userData?.photoUrl} className="h-20 w-20 rounded-full border-2 border-[#2563EB] object-cover sm:h-24 sm:w-24" />
              : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#2563EB] bg-[#EFF6FF] text-2xl font-semibold text-[#0F172A] sm:h-24 sm:w-24 sm:text-3xl">
                  {userData?.name.slice(0, 1).toUpperCase()}
                </div>
              )}
          </div>
          
          {/* render input fields for user to fill updated details like profile picture, name, email, description */}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#0F172A]">Select Avatar</label>
            <input
              type="file"
              name="photoUrl"
              onChange={(e) => setPhotoUrl(e.target.files[0])}
              className="block w-full cursor-pointer rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-2 text-[#475569] outline-none file:mr-3 file:rounded-lg file:border file:border-[#1D4ED8] file:bg-[#2563EB] file:px-3 file:py-1.5 file:text-white file:transition-colors hover:file:bg-[#1D4ED8] focus:border-[#2563EB]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#0F172A]">Full Name</label>
            <input
              type="text"
              placeholder={userData.name}
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-2 text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#2563EB]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#0F172A]">Email</label>
            <input
              type="email"
              readOnly
              placeholder={userData.email}
              className="w-full rounded-xl border border-[#CBD5E1] bg-[#E2E8F0] px-4 py-2 text-[#475569] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#0F172A]">Description</label>
            <textarea
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="w-full resize-none rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-2 text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#2563EB]"
            />
          </div>

          <button
            type="submit"
            disabled={loading} // disable this button if 'loading' state is 'true'
            onClick={updateProfile} // clicking this button calls 'updateProfile' function to send edited data to backend and update user's profile
            className="mt-1 inline-flex w-full items-center justify-center rounded-xl border border-[#1D4ED8] bg-[#2563EB] px-4 py-2.5 font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:border-[#64748B] disabled:bg-[#64748B] disabled:opacity-80"
          >
            {loading ? <ClipLoader size={30} color='#FFFFFF' /> : "Save Changes"} {/* if value of 'loading' is true, render loading spinner, otherwise render text 'Save Changes' */}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
