import { GoogleGenAI } from "@google/genai"; // import google Gen AI library to use google gemini AI
import dotenv from "dotenv"; // import 'dotenv' library to use environment variables
import Course from "../models/course.model.js";

dotenv.config(); // import environment variables for use

const searchCourses = async (searchText) => { // create a function to search courses from database using a search query text that is taken as argument
  const regex = new RegExp(searchText, "i"); // create an object of 'Regex' to create case-insensitive search query

  // find the course by case-insensitive search query using the search text provided
  return await Course.find({
    isPublished: true,
    $or: [
      { title: regex },
      { subTitle: regex },
      { description: regex },
      { category: regex },
      { level: regex },
    ],
  }).sort({ createdAt: -1 }) // sort by latest ie latest courses come first
};

export const searchWithAi = async (req, res) => { // create and export a function called 'searchWithAi' to reply user queries related to the course using google gemini AI
  try {
    const { input } = req.body; // extract user's input query from request body

    if (!input) return res.status(400).json({ message: "Search query is required" }); // if user hasn't provided any input query, return a 400 status code response with a JSON object containing message that search query is required to be given

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); // create an instance of google Gen AI class with google gemini API key provided to get replies from AI 

    // provided the prompt to be given to google gemini so that it can give a reply, provide input query given by the user so that gemini can provided accurate answers as per user's queries
    const prompt = `You are an intelligent assistant for an LMS platform. A user will type any query about what they want to learn. Your task is to understand the intent and return one **most relevant keyword** from the following list of course categories and levels:

- App Development  
- AI/ML  
- AI Tools  
- Data Science  
- Data Analytics  
- Ethical Hacking  
- UI UX Designing  
- Web Development  
- Others  
- Beginner  
- Intermediate  
- Advanced  

Only reply with one single keyword from the list above that best matches the query. Do not explain anything. No extra text.

Query: ${input}
`;

    // get google gemini's response using 2.5 flash model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const keyword = response.text.trim(); // extract the text of the response given by google gemini

    let courses = await searchCourses(input); // find published courses whose text fields match the input query

    if (courses.length > 0) return res.status(200).json(courses); // if courses are found in the database, return them
    
    else { // if no courses are found through input query
      courses = await searchCourses(keyword); // search courses using AI generated text
      return res.status(200).json(courses); // return the courses found in JSON form with status code 200
    }
  } catch (error) { // if any error occurs while interacting with google gemini
    console.log("Error: ", error); // log the error to the console to know what error occurred
    return res.status(500).json({ message: "Internal Server Error" }); // return 500 status code with an object containing message that internal server error occured
  }
};