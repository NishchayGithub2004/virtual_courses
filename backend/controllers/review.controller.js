// import 'Review' and 'Course' model to interact with user's reviews and courses user has given reviews to
import Review from "../models/review.model.js";
import Course from "../models/course.model.js";

export const addReview = async (req, res) => { // create and export a function called 'addReview' to add a review to a course
  try {
    const { rating, comment, courseId } = req.body; // extract user's rating and comment given to a course and unique ID of course user has given review to

    const userId = req.userId; // get user's unique ID from 'userId' property of request object

    const course = await Course.findById(courseId); // find the course from the database by it's unique ID

    // if no such course is found, return a 404 status code with a JSON object containing message that course was not found
    if (!course) return res.status(404).json({ message: "Course not found" });

    const alreadyReviewed = await Review.findOne({ course: courseId, user: userId }); // check if user has already reviewed a course by finding it from the database using user's and course's unique ID

    // if user has indeed already reviewed a course, return a 404 status code with a JSON object containing message that user has already reviewed the course
    if (alreadyReviewed) return res.status(400).json({ message: "You have already reviewed this course" });

    const review = new Review({ course: courseId, user: userId, rating, comment }); // otherwise create a new review in the database by inserting the following details:
    // unique ID of course user has reviewed, unique ID of user who has reviewed the course, rating and comment given by the user as review

    await review.save(); // save the changes to the database

    course.reviews.push(review._id); // add the new review created to the database using it's unique ID

    await course.save(); // save the changes to the database

    return res.status(201).json(review); // return a 201 status code with a JSON object containing review details
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: `An error occurred` });
  }
};

export const getCourseReviews = async (req, res) => { // create a function called 'getCourseReviews' to get reviews of a course
  try {
    const { courseId } = req.params; // get course's unique ID from request parameters

    const reviews = await Review.find({ course: courseId }); // find the review of a course from the database using course's unique ID

    return res.status(200).json(reviews); // return a 200 status code with a JSON object containing all reviews of a course
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: `An error occurred` });
  }  
};

export const getAllReviews = async (_, res) => { // create a function called 'getAllReviews' to get all reviews, it takes only response to send to the user as object
  try {
    // get all reviews from the database and populate each review with name, profile picture and role of user who gave the review, get the most recent reviews first
    const reviews = await Review.find({})
      .populate("user", "name photoUrl role")
      .sort({ reviewedAt: -1 });

    return res.status(200).json(reviews); // return a 200 status code with a JSON object containing all the reviews present in the database
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: `An error occurred` });
  }
};