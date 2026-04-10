import React, { useEffect, useState } from 'react'; // import 'useEffect' hook to run side-effects and 'useState' hook to create and manage state variables
import Card from "../components/Card.jsx"; // import 'Card' component to render UI displaying course details
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom'; // import 'useNavigate' hook to programmatically navigate b/w pages
import Nav from '../components/Nav'; // import 'Nav' component to render UI displaying navigation bar
import ai from '../assets/SearchAi.png';
import { useSelector } from 'react-redux'; // import 'useSelector' hook to access redux states

function AllCouses() { // create a functional component called 'AllCourses' to render UI displaying all courses
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // create a state variable 'isSidebarVisible' to know whether to show side bar or not and a function 'setIsSidebarVisible' to change it's value, it's initial value is false
  
  const [category, setCategory] = useState([]); // create a state variable 'category' to store selected categories and a function 'setCategory' to change it's value, it's initial value is an empty array
  
  const [filterCourses, setFilterCourses] = useState([]); // create a state variable 'filterCourses' to store filtered courses and a function 'setFilterCourses' to change it's value, it's initial value is an empty array
  
  const navigate = useNavigate(); // create an instance of 'useNavigate' hook to use it to programmatically navigate b/w pages
  
  const { courseData } = useSelector(state => state.course); // extract 'courseData' redux state from 'course' redux state

  const toggleCategory = (e) => { // create a function called 'toggleCategory' to handle category checkbox change event, it takes an event object as parameter
    if (category.includes(e.target.value)) { // if the category is already selected
      setCategory(prev => prev.filter(item => item !== e.target.value)); // remove the category from 'category' state
    } else {
      setCategory(prev => [...prev, e.target.value]); // otherwise add the category to 'category' state
    }
  };

  const applyFilter = () => { // create a function called 'applyFilter' to filter courses based on selected categories
    let courseCopy = courseData.slice(); // create a copy of 'courseData' state using 'slice' method
    
    if (category.length > 0) { // if there are selected categories
      courseCopy = courseCopy.filter(item => category.includes(item.category)); // filter the courses based on selected categories
    }
    
    setFilterCourses(courseCopy); // set value of 'filterCourses' state to filtered courses
  };

  useEffect(() => {
    setFilterCourses(courseData); // set value of 'filterCourses' state to 'courseData' state
  }, [courseData]); // this side-effect runs when value of 'courseData' state changes

  useEffect(() => {
    applyFilter();
  }, [category]); // call 'applyFilter' function when value of 'category' state changes

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Nav />

      <button
        onClick={() => setIsSidebarVisible(prev => !prev)} // clicking this button toggles value of 'isSidebarVisible' state
        className="fixed top-20 left-4 z-50 bg-white text-black px-3 py-1 rounded md:hidden border-2 border-black"
      >
        {isSidebarVisible ? 'Hide' : 'Show'} Filters {/* render text based on value of 'isSidebarVisible' */}
      </button>

      <aside
        className={`w-[260px] h-screen overflow-y-auto bg-black fixed top-0 left-0 p-6 py-[130px] border-r border-gray-200 shadow-md transition-transform duration-300 z-5 
        ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'} md:block md:translate-x-0`} // apply styles based on value of 'isSidebarVisible'
      >
        <h2 className="text-xl font-bold flex items-center justify-center gap-2 text-gray-50 mb-6">
          <FaArrowLeftLong
            onClick={() => navigate("/")} // clicking this icon takes user to home page
          />
          Filter by Category
        </h2>

        <form
          className="space-y-4 text-sm bg-gray-600 border-white text-[white] border p-[20px] rounded-2xl"
          onSubmit={(e) => e.preventDefault()} // do things we want to before the form is actually submitted
        >
          <button
            className="px-[10px] py-[10px] bg-black text-white rounded-[10px] text-[15px] font-light flex items-center justify-center gap-2 cursor-pointer"
            onClick={() => navigate("/searchwithai")} // clicking this button takes user to 'searchwithai' page
          >
            Search with AI
            <img src={ai} className="w-[30px] h-[30px] rounded-full" alt="" />
          </button>

          {/* render checkboxes for different types of courses, clicking them toggles value of 'toggleCategory' value */}
          
          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" value={'App Development'} onChange={toggleCategory} /> 
            App Development
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" value={'AI/ML'} onChange={toggleCategory} /> 
            AI/ML
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" value={'AI Tools'} onChange={toggleCategory} /> 
            AI Tools
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" value={'Data Science'} onChange={toggleCategory} /> 
            Data Science
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" value={'Data Analytics'} onChange={toggleCategory} /> 
            Data Analytics
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" value={'Ethical Hacking'} onChange={toggleCategory} /> 
            Ethical Hacking
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" value={'UI UX Designing'} onChange={toggleCategory} /> 
            UI UX Designing
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" value={'Web Development'} onChange={toggleCategory} /> 
            Web Development
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" value={'Others'} onChange={toggleCategory} /> 
            Others
          </label>
        </form>
      </aside>

      <main className="w-full transition-all duration-300 py-[130px] md:pl-[300px] flex items-start justify-center md:justify-start flex-wrap gap-6 px-[10px]">
        {
          // iterate over 'filterCourses' state ie array of filtered courses and render 'Card' component for each course, index of array element works as unique identifier, pass each course's data as props for each 'Card' component
          filterCourses?.map((item, index) => (
            <Card
              key={index}
              thumbnail={item.thumbnail}
              title={item.title}
              price={item.price}
              category={item.category}
              id={item._id}
              reviews={item.reviews}
            />
          ))
        }
      </main>
    </div>
  );
}

export default AllCouses;