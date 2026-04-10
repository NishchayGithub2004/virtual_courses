import mongoose from "mongoose"; // import 'mongoose' library to connect to MongoDB database

const connectDb = async () => { // create a function to connect to the MongoDB database
  try {
    const mongoUri = process.env.MONGODB_URL; // extract URI of MongoDB database

    // if URI of MongoDB database to connect to is not available, throw an error
    if (!mongoUri) {
      throw new Error("MONGODB_URL is not defined in .env");
    }

    await mongoose.connect(mongoUri); // connect to the MongoDB database
    
    console.log("MongoDB connected"); // log success message to the console
  } catch (error) { // if any error occurs while connecting to MongoDB database
    console.log("MongoDB connection failed:", error.message); // log the error to the console to know what error occured
  }
};

export default connectDb; // export the function to use it in other code files