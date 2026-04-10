import React from 'react'
import { useSelector } from "react-redux"; // import 'useSelector' hook to access redux states
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
/* import the following components from 'recharts' library:
1. BarChart: to render bar charts
2. Bar: to render bars of bar charts
3. XAxis: to render labels at X-axis
4. YAxis: to render labels at Y-axis
5. Tooltip: to show data or value a bar displays in the bar chart
6. ResponsiveContainer: so that bar chart adjusts it's dimensions on different screens
7. CartesianGrid: to render grid background on the bar chart */
import img from "../../assets/empty.jpg";
import { useNavigate } from 'react-router-dom'; // import 'useNavigate' hook to navigate to different pages
import { FaArrowLeftLong } from "react-icons/fa6";

function Dashboard() { // create a functional component called 'Dashboard' to render dashboard UI for the user
  const navigate = useNavigate() // create an instance of 'useNavigate' hook to use it to navigate to different pages

  const { userData } = useSelector((state) => state.user); // extract 'userData' redux state from 'user' slice
  
  const { creatorCourseData } = useSelector((state) => state.course); // extract 'creatorCourseData' redux state from 'course' slice

  const courseProgressData = creatorCourseData?.map(course => ({ // iterate over 'creatorCourseData' array to create an object containing user's course progress data
    name: course.title.slice(0, 10) + "...", // slice the course title to first 10 characters and add '...' to it
    lectures: course.lectures.length || 0 // get the number of lectures in the course or set it to 0 if it doesn't exist
  })) || [];

  const enrollData = creatorCourseData?.map(course => ({ // iterate over 'creatorCourseData' array to create an object containing user's course enrollment data
    name: course.title.slice(0, 10) + "...", // slice the course title to first 10 characters and add '...' to it
    enrolled: course.enrolledStudents?.length || 0 // get the number of enrolled students in the course or set it to 0 if it doesn't exist
  })) || [];

  const totalEarnings = creatorCourseData?.reduce((sum, course) => { // calculate total earnings made by selling courses by iterating over 'creatorCourseData' array and summing up the revenue of each course
    const studentCount = course.enrolledStudents?.length || 0 // get the number of enrolled students in the course or set it to 0 if it doesn't exist
    const courseRevenue = course.price ? course.price * studentCount : 0 // calculate the revenue of the course by multiplying the price of the course with the number of enrolled students or set it to 0 if either of them doesn't exist
    return sum + courseRevenue // return the sum of revenue of all courses
  }, 0) || 0;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <FaArrowLeftLong
        className=' w-[22px] absolute top-[10%] left-[10%] h-[22px] cursor-pointer'
        onClick={() => navigate("/")} // clicking this icon takes user to home page
      />

      <div className="w-full px-6 py-10 bg-gray-50 space-y-10">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6">
          <img
            src={userData?.photoUrl || img} // render user's profile picture or a default image if it doesn't exist
            alt="Educator"
            className="w-28 h-28 rounded-full object-cover border-4 border-black shadow-md"
          />

          <div className="text-center md:text-left space-y-1">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {userData?.name || "Educator"} {/* render educator's name of 'Educator' text if it doesn't exist */}
            </h1>
            <h1 className='text-xl font-semibold text-gray-800'>
              Total Earning : <span className='font-light text-gray-900'>₹{totalEarnings.toLocaleString()}</span> {/* render total earning of the educator */}
            </h1>
            <p className="text-gray-600 text-sm">
              {userData?.description || "Start creating amazing courses for your students!"} {/* render description of user or fallback text if it doesn't exist */}
            </p>
            <h1
              className='px-[10px] text-center py-[10px] border-2 bg-black border-black text-white rounded-[10px] text-[15px] font-light flex items-center justify-center gap-2 cursor-pointer'
              onClick={() => navigate("/courses")} // clicking this heading takes user to courses page
            >
              Create Courses
            </h1>
          </div>
        </div>

        {/* render course progress and students enrollment data in the courses as bar charts */}

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Course Progress (Lectures)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="lectures" fill="black" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Student Enrollment</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enrolled" fill="black" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard