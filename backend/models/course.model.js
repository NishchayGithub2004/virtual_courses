import mongoose from "mongoose" // import 'mongoose' library to create MongoDB schema

const courseSchema = new mongoose.Schema({ // create a schema for course that contains the following properties
    // title of the course which takes string value and must be given
    title: {
        type: String,
        required: true
    },
    // sub title of the course which takes string value and is optional to give
    subTitle: {
        type: String
    },
    // description of the course which takes string value and is optional to give
    description: {
        type: String
    },
    // category of the course which takes string value and must be given
    category: {
        type: String,
        required: true
    },
    // level of the course which takes string value and takes one of the three provided values
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    // price of the course which takes number value and is optional to give
    price: {
        type: Number
    },
    // thumbnail ie URL of image of the course which takes string value and is optional to give
    thumbnail: {
        type: String
    },
    // students enrolled in the course which takes an array of documents of 'User' collection
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    // lectures in the course which takes an array of documents of 'Lecture' collection
    lectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture"
    }],
    // creator of the course which takes a single document of 'User' collection
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // boolean value telling whether the course is published or not, it's default value is false ie if this value is not provided, false will be taken as value
    isPublished: {
        type: Boolean,
        default: false
    },
    // reviews of the course which takes an array of documents of 'User' collection
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
}, { timestamps: true }) // store the time a document is added or updated in the collection

const Course = mongoose.model("Course", courseSchema) // create a model named 'Course' with the course schema

export default Course // export the Course model
