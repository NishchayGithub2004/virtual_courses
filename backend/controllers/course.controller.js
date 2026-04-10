import uploadOnCloudinary from "../configs/cloudinary.js"; // import 'uploadOnCloudinary' function to upload files to cloudinary server
// import 'Course', 'Lecture' and 'User' models to interact with their respective data
import Course from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";
import User from "../models/user.model.js";

export const createCourse = async (req, res) => { // create and export a function called 'createCourse' to create a new course
    try {
        const { title, category } = req.body; // extract title and category of new course from request body

        // if either title or category is not provided, return a 404 status code with a JSON object containing message that both title and category must be provided
        if (!title || !category) return res.status(400).json({ message: "title and category is required" });

        // otherwise, create a new course by providing the following details: title, category, and creator of course who is provided by unique ID of the user
        const course = await Course.create({
            title,
            category,
            creator: req.userId
        });

        return res.status(201).json(course); // return a 201 status code with a JSON object containing the newly created course details
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: `An error occurred` });
    }
};

export const getPublishedCourses = async (_, res) => { // create and export a function called 'getPublishedCourses' to get all published courses, it takes only response to be given by the backend as argument in object form
    try {
        const courses = await Course.find({ isPublished: true }).populate("lectures reviews"); // find courses from the database that are published and populate the lectures and reviews fields of each course with data of lectures in that course and reviews provided to the course

        if (!courses) return res.status(404).json({ message: "Course not found" }); // if no published courses are found, return a 404 status code with a JSON object containing a message that no courses were found

        return res.status(200).json(courses); // otherwise, return a 200 status code with a JSON object containing the details of all published courses
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: `An error occurred` });
    }
};

export const getCreatorCourses = async (req, res) => { // create and export a function called 'getCreatorCourses' to get all courses created by a specific user, it takes request and response to be given by the backend as argument in object form
    try {
        const userId = req.userId; // extract the unique ID of the user from the request object

        const courses = await Course.find({ creator: userId }); // find courses from the database that are created by the specific user

        // if no courses are found, return a 404 status code with a JSON object containing a message that no courses were found
        if (!courses) return res.status(404).json({ message: "Course not found" });

        return res.status(200).json(courses); // otherwise, return a 200 status code with a JSON object containing the details of all courses created by the specific user
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: `An error occurred` });
    }
};

export const editCourse = async (req, res) => { // create and export a function called 'editCourse' to edit a course
    try {
        const { courseId } = req.params; // extract the unique ID of the course from the request parameters

        // extract the following details about the course from the request body: title, sub title, description, category, level, price, and status of whether it is published or not
        const { title, subTitle, description, category, level, price, isPublished } = req.body;

        let thumbnail; // create a variable to store the thumbnail of the course

        if (req.file) thumbnail = await uploadOnCloudinary(req.file.path); // if a thumbnail is provided in the request, upload it to cloudinary and store the URL of the uploaded thumbnail in the 'thumbnail' variable

        let course = await Course.findById(courseId); // find the course in the database by its unique ID

        if (!course) return res.status(404).json({ message: "Course not found" }); // if no course is found, return a 404 status code with a JSON object containing a message that the course was not found

        const updateData = { title, subTitle, description, category, level, price, isPublished, thumbnail }; // create an object containing the updated details of the course

        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true }); // find the course in the database by its unique ID and update it with the updated details in the 'updateData' object and create a new object containing the updated course details

        return res.status(200).json(course); // return a 200 status code with a JSON object containing the updated course details
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: `An error occurred` });
    }
};

export const getCourseById = async (req, res) => { // create and export a function called 'getCourseById' to get a course's details by its unique ID
    try {
        const { courseId } = req.params; // extract the unique ID of the course from the request parameters

        let course = await Course.findById(courseId); // find the course in the database by its unique ID

        if (!course) return res.status(404).json({ message: "Course not found" }); // if no course is found, return a 404 status code with a JSON object containing a message that the course was not found

        return res.status(200).json(course); // otherwise, return a 200 status code with a JSON object containing the course details
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: `An error occurred` });
    }
};

export const removeCourse = async (req, res) => { // create and export a function called 'removeCourse' to remove a course from the database
    try {
        const courseId = req.params.courseId; // extract the unique ID of the course from the request parameters

        const course = await Course.findById(courseId); // find the course in the database by its unique ID

        if (!course) return res.status(404).json({ message: "Course not found" }); // if no course is found, return a 404 status code with a JSON object containing a message that the course was not found

        await course.deleteOne(); // delete the course from the database

        return res.status(200).json({ message: "Course Removed Successfully" }); // return a 200 status code with a JSON object containing a message that the course was removed successfully
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: `An error occurred` });
    }
};

export const createLecture = async (req, res) => { // create and export a function called 'createLecture' to create a new lecture for a course
    try {
        const { lectureTitle } = req.body; // extract the title of the new lecture from the request body

        const { courseId } = req.params; // extract the unique ID of the course from the request parameters

        // if lecture title or course ID is not provided, return a 404 status code with a JSON object containing a message that both lecture title and course ID must be provided
        if (!lectureTitle || !courseId) return res.status(400).json({ message: "Lecture title required" });

        const lecture = await Lecture.create({ lectureTitle }); // create a new lecture with the lecture title provided

        const course = await Course.findById(courseId); // find the course in the database by its unique ID

        if (course) course.lectures.push(lecture._id); // if the course is found, push the ID of the new lecture to the 'lectures' array of the course to add the lecture to the course

        await course.populate("lectures"); // populate the 'lectures' field of the course with the details of the new lecture

        await course.save(); // save the updated course data to the database

        return res.status(201).json({ lecture, course }); // return a 201 status code with a JSON object containing the details of the new lecture and the updated course data (after adding lecture)
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: `An error occurred` });
    }
};

export const getCourseLecture = async (req, res) => { // create and export a function called 'getCourseLecture' to get all lectures of a course
    try {
        const { courseId } = req.params; // extract the unique ID of the course from the request parameters

        const course = await Course.findById(courseId); // find the course in the database by its unique ID

        if (!course) return res.status(404).json({ message: "Course not found" }); // if no course is found, return a 404 status code with a JSON object containing a message that the course was not found

        await course.populate("lectures"); // populate the 'lectures' field of the course with the details of all lectures in the course

        await course.save(); // save the updated course data to the database

        return res.status(200).json(course); // return a 200 status code with a JSON object containing the updated course data (after populating the 'lectures' field)
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: `An error occurred` });
    }
};

export const editLecture = async (req, res) => { // create and export a function called 'editLecture' to edit a lecture's details
    try {
        const { lectureId } = req.params; // extract the unique ID of the lecture from the request parameters

        const { lectureTitle, isPreviewFree } = req.body; // extract the following details about the lecture from the request body: lecture title, and status of whether it is free for preview or not

        const lecture = await Lecture.findById(lectureId); // find the lecture in the database by its unique ID

        if (!lecture) return res.status(404).json({ message: "Lecture not found" }); // if no lecture is found, return a 404 status code with a JSON object containing a message that the lecture was not found

        let videoUrl; // create a variable to store the URL of the lecture's video

        if (req.file) { // if a video is provided in the request
            videoUrl = await uploadOnCloudinary(req.file.path); // upload the video to cloudinary and store the URL of the uploaded video in the 'videoUrl' variable
            lecture.videoUrl = videoUrl; // update the 'videoUrl' field of the lecture with the URL of the uploaded video
        }

        if (lectureTitle) lecture.lectureTitle = lectureTitle; // if lecture title is provided, update the 'lectureTitle' field of the lecture with the provided lecture title

        lecture.isPreviewFree = isPreviewFree; // update the 'isPreviewFree' field of the lecture with the provided status of whether it is free for preview or not

        await lecture.save(); // save the updated lecture data to the database

        return res.status(200).json(lecture); // return a 200 status code with a JSON object containing the updated lecture data
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: `An error occurred` });
    }
};

export const removeLecture = async (req, res) => { // create and export a function called 'removeLecture' to remove a lecture from a course
    try {
        const { lectureId } = req.params; // extract the unique ID of the lecture from the request parameters

        const lecture = await Lecture.findByIdAndDelete(lectureId); // find the lecture in the database by its unique ID and delete it

        if (!lecture) return res.status(404).json({ message: "Lecture not found" }); // if no lecture is found, return a 404 status code with a JSON object containing a message that the lecture was not found

        // find the course in the database by its unique ID and remove the lecture ID from the 'lectures' array of the course to remove the lecture from the course
        await Course.updateOne(
            { lectures: lectureId },
            { $pull: { lectures: lectureId } }
        );

        return res.status(200).json({ message: "Lecture Remove Successfully" }); // return a 200 status code with a JSON object containing a message that the lecture was removed successfully
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: `An error occurred` });
    }
};

export const getCreatorById = async (req, res) => { // create and export a function called 'getCreatorById' to get a course creator's details by its unique ID
    try {
        const { userId } = req.body; // extract the unique ID of the course creator from the request body

        const user = await User.findById(userId).select("-password"); // find the course creator in the database by its unique ID and exclude the password field from the returned user object

        if (!user) return res.status(404).json({ message: "User not found" }); // if no course creator is found, return a 404 status code with a JSON object containing a message that the course creator was not found

        res.status(200).json(user); // otherwise, return a 200 status code with a JSON object containing the course creator details
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: `An error occurred` });
    }
};