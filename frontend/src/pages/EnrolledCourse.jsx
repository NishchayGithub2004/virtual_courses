import React from 'react';
import { useSelector } from 'react-redux'; // import 'useSelector' hook to access redux states
import { useNavigate } from 'react-router-dom'; // import 'useNavigate' hook to programmatically navigate b/w pages
import { FaArrowLeftLong } from "react-icons/fa6";

function EnrolledCourse() { // create a functional component called 'EnrolledCourse' to render UI displaying courses user is enrolled in
  const navigate = useNavigate(); // create an instance of 'useNavigate' hook to use it to programmatically navigate b/w pages

  const { userData } = useSelector((state) => state.user); // extract 'userData' redux state from 'user' redux state
  
  return (
    <div className="min-h-screen w-full px-4 py-9 bg-gray-50">
      <FaArrowLeftLong onClick={() => navigate("/")} /> {/* clicking this button takes user to home page */}

      <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">My Enrolled Courses</h1>

      {userData.enrolledCourses.length === 0 ? ( // if user isn't enrolled in any course, render a paragraph telling so
        <p className="text-gray-500 text-center w-full">You haven’t enrolled in any course yet.</p>
      ) : (
        <div className="flex items-center justify-center flex-wrap gap-[30px]">
          {userData.enrolledCourses.map((course) => ( // else, iterate over the courses user is enrolled in and render details for each course like thumbnail, title, category, level and a button to watch the course
            <div key={course._id} className="bg-white rounded-2xl shadow-md overflow-hidden border">
              <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
                <p className="text-sm text-gray-600 mb-2">{course.category}</p>
                <p className="text-sm text-gray-700">{course.level}</p>
                <h1 onClick={() => navigate(`/viewlecture/${course._id}`)}>Watch Now</h1>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EnrolledCourse;