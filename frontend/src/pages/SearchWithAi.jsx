import React, { useState } from 'react' // import 'useState' hook to create and manage state variables
import ai from "../assets/ai.png"
import ai1 from "../assets/SearchAi.png"
import { RiMicAiFill } from "react-icons/ri";
import axios from 'axios'; // import 'axios' library to make HTTP requests to the backend
import { serverUrl } from '../App'; // import base URL to make request to
import { useNavigate } from 'react-router-dom'; // import 'useNavigate' hook to programmatically navigate b/w pages
import start from "../assets/start.mp3"
import { FaArrowLeftLong } from "react-icons/fa6";

function SearchWithAi() { // create a functional component called 'SearchWithAi' to render UI for searching courses with AI
  const [input, setInput] = useState('') // create a state variable called 'input' to store user's input and a function called 'setInput' to update it's value, it's initial value is an empty string

  const [recommendations, setRecommendations] = useState([]) // create a state variable called 'recommendations' to store AI recommendations and a function called 'setRecommendations' to update it's value, it's initial value is an empty array
  
  const [listening, setListening] = useState(false) // create a state variable called 'listening' to store whether user is currently listening to AI and a function called 'setListening' to update it's value, it's initial value is false

  const navigate = useNavigate() // create an instance of 'useNavigate' hook to use it to programmatically navigate b/w pages

  const startSound = new Audio(start) // create an audio object that will play the sound file stored in `start`

  function speak(message) { // create a function called 'speak' to speak text message, it takes text message as argument
    let utterance = new SpeechSynthesisUtterance(message) // create a speech object containing the text to be spoken
    window.speechSynthesis.speak(utterance) // use the browser’s text-to-speech engine to speak the message aloud
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition // use the browser’s Speech Recognition API (standard or WebKit version for compatibility)

  const recognition = SpeechRecognition ? new SpeechRecognition() : null // only create a recognition instance when the browser supports it

  if (!recognition) console.log("Speech recognition not supported") // if speech recognition is not supported, log a message to the console that it is not

  const handleSearch = async () => { // create a function called 'handleSearch' to handle user's search query
    if (!recognition) return // if speech recognition is not supported, don't execute the function

    setListening(true) // set value of 'listening' state variable to true to indicate that user is currently listening to AI

    startSound.play() // play the sound file stored in `startSound` variable
    
    recognition.start() // start listening for user's speech

    recognition.onresult = async (e) => { // when user's speech is recognized, execute the following code
      const transcript = e.results[0][0].transcript.trim() // get the recognized speech and store it in a variable called 'transcript'
      setInput(transcript) // set value of 'input' state variable to the recognized speech
      await handleRecommendation(transcript) // call 'handleRecommendation' function with recognized speech as argument to get AI recommendations for the recognized speech
    }
  }

  const handleRecommendation = async (query) => { // create a function called 'handleRecommendation' to get AI recommendations for user's search query, it takes search query as argument
    try {
      const result = await axios.post(`${serverUrl}/api/ai/search`, { input: query }, { withCredentials: true })
      // make a POST request to this URL and send user's input to get AI recommendations for the search query, send cookies to the backend also for user authentication so that only authenticated users can make this request
      
      setRecommendations(result.data) // set value of 'recommendations' state variable to the AI recommendations returned by the backend
      
      if (result.data.length > 0) speak("These are the top courses I found for you") // if AI recommendations are found, speak the message to the user
      
      else speak("No courses found") // otherwise speak the message that no courses were found

      setListening(false) // set value of 'listening' state variable to false to indicate that user is not currently listening to AI
    } catch (error) { // if any error occurs while getting AI recommendations
      console.log(error) // log the error to the console to know what error occurred
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center px-4 py-16">
      <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-center relative">
        <FaArrowLeftLong
          className='text-[black] w-[22px] h-[22px] cursor-pointer absolute'
          onClick={() => navigate("/")} // clicking this icon takes user to home page
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-600 mb-6 flex items-center justify-center gap-2">
          <img src={ai} className='w-8 h-8 sm:w-[30px] sm:h-[30px]' alt="AI" />
          Search with <span className='text-[#CB99C7]'>AI</span>
        </h1>

        <div className="flex items-center bg-gray-700 rounded-full overflow-hidden shadow-lg relative w-full ">
          {/* render input field to write input query for the AI to give answer to */}
          <input
            type="text"
            className="flex-grow px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base"
            placeholder="What do you want to learn? (e.g. AI, MERN, Cloud...)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          {input && ( // if user provides input query
            <button
              onClick={() => handleRecommendation(input)} // clicking this button calls 'handleRecommendation' function to get AI recommendations for the input query
              className="absolute right-14 sm:right-16 bg-white rounded-full"
            >
              <img src={ai} className='w-10 h-10 p-2 rounded-full' alt="Search" />
            </button>
          )}

          <button
            className="absolute right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center"
            onClick={handleSearch} // clicking this button calls 'handleSearch' function to start listening for user's speech
          >
            <RiMicAiFill className="w-5 h-5 text-[#cb87c5]" />
          </button>
        </div>
      </div>

      {recommendations.length > 0 ? ( // if AI returns recommendations
        <div className="w-full max-w-6xl mt-12 px-2 sm:px-4">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-white text-center flex items-center justify-center gap-3">
            <img src={ai1} className="w-10 h-10 sm:w-[60px] sm:h-[60px] p-2 rounded-full" alt="AI Results" />
            AI Search Results
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {recommendations.map((course, index) => ( // iterate over all recommendations returned by AI
              <div
                key={index} // index of recommendation is it's unique identifier
                className="bg-white text-black p-5 rounded-2xl shadow-md hover:shadow-indigo-500/30 transition-all duration-200 border border-gray-200 cursor-pointer hover:bg-gray-200"
                onClick={() => navigate(`/viewcourse/${course._id}`)} // clicking this container takes user to page where user can see the course's details
              >
                {/* render the course' title and category */}
                <h3 className="text-lg font-bold sm:text-xl">{course.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{course.category}</p>
              </div>
            ))}
          </div>
        </div>
      ) : ( // if no recommendations are returned by AI
        listening // if AI is still listening for user's speech, render first text, second otherwise
          ? <h1 className='text-center text-xl sm:text-2xl mt-10 text-gray-400'>Listening...</h1>
          : <h1 className='text-center text-xl sm:text-2xl mt-10 text-gray-400'>No Courses Found</h1>
      )}
    </div>
  )
}

export default SearchWithAi;
