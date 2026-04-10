import React from 'react';
import { useSelector } from 'react-redux'; // import 'useSelector' hook to access redux states
import { useNavigate } from 'react-router-dom'; // import 'useNavigate' hook to programmatically navigate b/w pages
import { FaArrowLeftLong } from "react-icons/fa6";

function Profile() { // create a functional component called 'Profile' to render UI displaying user's profile
  let { userData } = useSelector(state => state.user); // extract 'userData' redux state from 'user' redux state

  let navigate = useNavigate(); // create an instance of 'useNavigate' hook to use it to programmatically navigate b/w pages

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-4 sm:py-6">
      <div className="relative w-full max-w-xl rounded-2xl border border-[#CBD5E1] bg-white p-5 shadow-lg shadow-[#0F172A]/10 sm:p-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute left-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#2563EB] text-[#2563EB] transition-colors hover:bg-[#DBEAFE] sm:left-5 sm:top-5 sm:h-9 sm:w-9"
        >
          <FaArrowLeftLong className="h-4 w-4" />
        </button> {/* clicking this icon takes user to home page */}
        
        <div className="flex flex-col items-center text-center">
          {/* if user's profile picture is available, render it, otherwise render user's name's first letter in upper case */}
          {userData.photoUrl ? (
            <img src={userData?.photoUrl} className="h-20 w-20 rounded-full border-2 border-[#2563EB] object-cover sm:h-24 sm:w-24" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#2563EB] bg-[#EFF6FF] text-2xl font-semibold text-[#0F172A] sm:h-24 sm:w-24 sm:text-3xl">
              {userData?.name.slice(0, 1).toUpperCase()}
            </div>
          )}
          {/* render user's full name and role (student or teacher) */}
          <h2 className="mt-3 text-2xl font-bold text-[#0F172A]">{userData.name}</h2>
          <p className="mt-1 rounded-full border border-[#F59E0B] bg-[#FFFBEB] px-3 py-1 text-sm font-medium capitalize text-[#92400E]">{userData.role}</p>
        </div>

        {/* render user's email address, bio/description, and number of courses it is enrolled in */}
        
        <div className="mt-5 space-y-3">
          <div className="rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-3">
            <span className="text-sm font-semibold text-[#0F172A]">Email: </span>
            <span className="break-all text-sm text-[#475569]">{userData.email}</span>
          </div>

          <div className="rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-3">
            <span className="text-sm font-semibold text-[#0F172A]">Bio: </span>
            <span className="text-sm text-[#475569]">{userData.description}</span>
          </div>

          <div className="rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-3">
            <span className="text-sm font-semibold text-[#0F172A]">Enrolled Courses: </span>
            <span className="text-sm text-[#475569]">{userData.enrolledCourses.length}</span>
          </div>
        </div>

        <div className="mt-5 flex justify-center">
          <button
            onClick={() => navigate("/editprofile")}
            className="inline-flex w-full items-center justify-center rounded-xl border border-[#1D4ED8] bg-[#2563EB] px-4 py-2.5 font-semibold text-white transition-colors hover:bg-[#1D4ED8] sm:w-auto sm:min-w-[180px]"
          > {/* clicking this button takes user to page where it can edit it's profile */}
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
