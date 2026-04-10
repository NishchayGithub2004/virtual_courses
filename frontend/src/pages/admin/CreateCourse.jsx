import axios from "axios"; // import 'axios' library to make HTTP requests to the backend
import React, { useState } from "react"; // import 'useState' hook to create and manage state variables
import { FaArrowLeftLong } from "react-icons/fa6"; // import 'FaArrowLeftLong' icon from 'react-icons/fa6' library
import { useNavigate } from "react-router-dom"; // import 'useNavigate' hook to programmatically navigate b/w different pages
import { serverUrl } from "../../App"; // import base URL to make backend requests to
import { toast } from "react-toastify"; // import 'toast' component to render toast/pop-up messages
import { ClipLoader } from "react-spinners"; // import 'ClipLoader' component to show loading spinner

const CreateCourse = () => {
    let navigate = useNavigate() // create an instance of 'useNavigate' hook to programmatically navigate b/w different pages

    let [loading, setLoading] = useState(false) // create a state variable 'loading' to know whether to render loading spinner or not and function 'setLoading' to change it's value
    
    const [title, setTitle] = useState("") // create a state variable 'title' to set the title of the course and function 'setTitle' to change it's value
    
    const [category, setCategory] = useState("") // create a state variable 'category' to set the category of the course and function 'setCategory' to change it's value

    const CreateCourseHandler = async () => { // create a function called 'CreateCourseHandler' to create a course
        setLoading(true) // set value of 'loading' to true to render loading spinner

        try {
            await axios.post(serverUrl + "/api/course/create", { title, category }, { withCredentials: true })
            // make a POST request to this backend URL and send new course's title and category to it and send cookies with the request to ensure only authenticated users make the request
            toast.success("Course Created") // render a toast/pop-up message that the course has been created
            navigate("/courses") // navigate to the courses page
            setTitle("") // clear the title of the course
            setLoading(false) // set value of 'loading' to false to stop rendering loading spinner
        } catch (error) { // if any error occurs while creating the course
            console.log(error) // log the error to the console to know what error occurred
            setLoading(false) // set value of 'loading' to false to stop rendering loading spinner
            toast.error(error.response.data.message) // render a toast/pop-up message with the error message given by the backend
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
            <div className="max-w-xl w-[600px] mx-auto p-6 bg-white shadow-md rounded-md mt-10 relative">
                <FaArrowLeftLong
                    className='top-[8%] absolute left-[5%] w-[22px] h-[22px] cursor-pointer'
                    onClick={() => navigate("/courses")} // clicking this icon takes user to courses page
                />

                <h2 className="text-2xl font-semibold mb-6 text-center">Create Course</h2>

                <form
                    className="space-y-5"
                    onSubmit={(e) => e.preventDefault()} // submitting this form does some things we want before actually submitting the form 
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Course Title
                        </label>
                        <input
                            type="text"
                            placeholder="Enter course title"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[black]"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[black]"
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select category</option>
                            <option value="App Development">App Development</option>
                            <option value="AI/ML">AI/ML</option>
                            <option value="AI Tools">AI Tools</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Data Analytics">Data Analytics</option>
                            <option value="Ethical Hacking">Ethical Hacking</option>
                            <option value="UI UX Designing">UI UX Designing</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[black] text-white py-2 px-4 rounded-md active:bg-[#3a3a3a] transition"
                        disabled={loading} // disable this button if value of 'loading' is false
                        onClick={CreateCourseHandler} // clicking this button calls 'CreateCourseHandler' function
                    >
                        {loading ? <ClipLoader size={30} color='white' /> : "Create"} {/* if value of 'loading' is true, render a loading spinner, otherwise render the text 'Create' */}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateCourse