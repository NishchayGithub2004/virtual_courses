import React, { useState, useMemo } from 'react'; // import 'useState' hook to create and manage state variables and 'useMemo' hook to remember a value so that we don't recalculate it again
import { useSelector } from 'react-redux'; // import 'useSelector' hook to access redux states
import { useNavigate, useParams } from 'react-router-dom'; // import 'useNavigate' hook to programmatically navigate b/w pages and 'useParams' hook to access URL parameters
import { FaPlayCircle } from 'react-icons/fa';
import { FaArrowLeftLong } from "react-icons/fa6";

function ViewLecture() { // create a functional component called 'ViewLecture' to render UI displaying a course's lectures
  const { courseId } = useParams(); // extract unique ID of the course from URL parameters
  
  const { courseData } = useSelector((state) => state.course); // extract 'courseData' redux state from 'course' redux state
  
  const { userData } = useSelector((state) => state.user); // extract 'userData' redux state from 'user' redux state

  const selectedCourse = useMemo(() => courseData?.find(course => course._id === courseId), [courseData, courseId]);

  const [selectedLecture, setSelectedLecture] = useState(selectedCourse?.lectures?.[0] || null);
  // create a state variable 'selectedLecture' to store the currently selected lecture and a function 'setSelectedLecture' to change it's value, it's initial value is the first lecture of the course or null if not available
  
  const navigate = useNavigate(); // create an instance of 'useNavigate' hook to use it to programmatically navigate b/w pages
  
  const courseCreator = userData?._id === selectedCourse?.creator ? userData : null; // if user is creator of selected course, store user's data in 'courseCreator' variable, otherwise store null

  if (!selectedCourse) { // if no course is selected, render a message saying that no course is found
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center justify-start gap-[20px] text-gray-800">
            <FaArrowLeftLong
              className='text-black w-[22px] h-[22px] cursor-pointer'
              onClick={() => navigate("/")} // clicking this icon takes user to home page
            />
            {selectedCourse?.title} {/* render title of selected course */}
          </h1>

          <div className="mt-2 flex gap-4 text-sm text-gray-500 font-medium">
            {/* render selected course's category and level */}
            <span>Category: {selectedCourse?.category}</span>
            <span>Level: {selectedCourse?.level}</span>
          </div>
        </div>

        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 border border-gray-300">
          {selectedLecture?.videoUrl ? ( // if selected lecture has a video URL, render it, otherwise render a message that you need to select a lecture
            <video
              src={selectedLecture.videoUrl}
              controls
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              Select a lecture to start watching
            </div>
          )}
        </div>

        <div className="mt-2">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedLecture?.lectureTitle} {/* render title of selected lecture */}
          </h2>
        </div>
      </div>

      <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200 h-fit">
        <h2 className="text-xl font-bold mb-4 text-gray-800">All Lectures</h2>

        <div className="flex flex-col gap-3 mb-6">
          {selectedCourse?.lectures?.length > 0 ? ( // if selected course has lectures
            selectedCourse.lectures.map((lecture, index) => ( // iterate over the selected course's lectures
              <button
                key={index} // index of current lecture of selected course is it's unique identifier
                onClick={() => setSelectedLecture(lecture)} // clicking this button sets value of 'selectedLecture' state to current lecture
                className={`flex items-center justify-between p-3 rounded-lg border transition text-left ${
                  selectedLecture?._id === lecture._id // apply styles based on whether current lecture is selected or not
                    ? 'bg-gray-200 border-gray-500'
                    : 'hover:bg-gray-50 border-gray-300'
                }`}
              >
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">
                    {lecture.lectureTitle} {/* render current lecture's title */}
                  </h4>
                </div>
                <FaPlayCircle className="text-black text-xl" />
              </button>
            ))
          ) : (
            <p className="text-gray-500">No lectures available.</p> // if selected course has no lectures, render a message that no lectures are available
          )}
        </div>

        {courseCreator && ( // if user is creator of selected course
          <div className="mt-4 border-t pt-4">
            <h3 className="text-md font-semibold text-gray-700 mb-3">Instructor</h3>
            <div className="flex items-center gap-4">
              <img
                src={courseCreator.photoUrl || defaultAvatar} // render instructor's photo or default avatar if not available
                alt="Instructor"
                className="w-14 h-14 rounded-full object-cover border"
              />

              <div>
                <h4 className="text-base font-medium text-gray-800">
                  {courseCreator.name} {/* render instructor's name */}
                </h4>
                <p className="text-sm text-gray-600">
                  {courseCreator.description || 'No bio available.'} {/* render instructor's bio or a message that no bio is available if not available */}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewLecture;