import mongoose from "mongoose"; // import 'mongoose' library to create MongoDB schema

const userSchema = new mongoose.Schema( // create a schema for user that contains the following properties
  {
    // name which takes string value and must be given
    name: {
      type: String,
      required: true
    },
    // email which takes string value and must be given and must have a unique value
    email: {
      type: String,
      required: true,
      unique: true
    },
    // password which takes string value
    password: {
      type: String
    },
    // description which takes string value
    description: {
      type: String
    },
    // role which takes string value and must be given one of the two values given below and must be given
    role: {
      type: String,
      enum: ["educator", "student"],
      required: true
    },
    // URL of user's profile picture which takes string value and takes empty string as value if no value is provided
    photoUrl: {
      type: String,
      default: ""
    },
    // courses user is enrolled in which takes an array of documents of 'Course' collection
    enrolledCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }],
    // new OTP which takes string value
    resetOtp: {
      type: String
    },
    // date at which OTP expires and takes 'Date' object as value
    otpExpires: {
      type: Date
    },
    // boolean value that tells whether the OTP is correct or not and takes false as value is no value is provided
    isOtpVerifed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true } // store the time a document is added or updated in the collection
);

const User = mongoose.model("User", userSchema); // create a model named 'User' with the user schema

export default User; // export the User model
