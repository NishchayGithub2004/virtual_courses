import uploadOnCloudinary from "../configs/cloudinary.js"; // import 'uploadOnCloudinary' function to upload user's profile photo to cloudinary
import User from "../models/user.model.js"; // import 'User' model to interact with user data

export const getCurrentUser = async (req, res) => { // create and export a function called 'getCurrentUser' to get current user's details
  try {
    // find user's details in the database by it's ID and select it's all details except password and populate it's 'enrolledCourses' field with details of courses the user is enrolled in
    const user = await User.findById(req.userId)
      .select("-password")
      .populate("enrolledCourses");

    if (!user) return res.status(400).json({ message: "User was not found" }); // if no user is found, return a 400 status code response with a JSON object containing message that user was not found

    return res.status(200).json(user); // otherwise, return a 200 status code response with a JSON object containing user's details
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: `An error occurred` });
  }
};

export const updateProfile = async (req, res) => { // create and export a function called 'UpdateProfile' to update user's profile picture
  try {
    const userId = req.userId; // get user's unique ID from request object's 'userId' property

    const { name, description } = req.body; // get user's name and description from request body

    let photoUrl; // create a variable to store URL of user's profile picture present in cloudinary server

    if (req.file) photoUrl = await uploadOnCloudinary(req.file.path); // if user has provided a new profile picture, upload it to the cloudinary server

    // find the user in the database by it's ID and update it's name, description, and profile picture with the new values provided
    const user = await User.findByIdAndUpdate(userId, { name, description, photoUrl });

    // if no user is found, return a 400 status code with a JSON object containing message that user was not found (whose profile picture was to be updated)
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.save(); // save the changes to the database

    return res.status(200).json(user); // return a 200 status code with a JSON object containing user's updated details
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: `An error occurred` });
  }
};