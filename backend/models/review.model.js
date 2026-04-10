import mongoose from "mongoose"; // import 'mongoose' library to create MongoDB schema

const reviewSchema = new mongoose.Schema( // create a schema for course review that contains the following properties
  {
    // course to review that takes a document of 'Course' collection and must be given
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    // user who is giving the review that takes a document of 'Course' collection and must be given
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // rating that takes number value and must be given and takes value b/w 1 and 5 (both inclusive)
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    // comment given as review that takes string value and must be trimmed to remove unnecessary white spaces
    comment: {
      type: String,
      trim: true
    },
    // date at which review is given that takes 'Date' object and takes default value of today's date if value is not provided
    reviewedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true } // store the time a document is added or updated in the collection
)

const Review = mongoose.model("Review", reviewSchema); // create a model named 'Review' with the review schema

export default Review; // export the Review model
