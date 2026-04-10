import mongoose from "mongoose"; // import 'mongoose' library to create MongoDB schema

const lectureSchema = new mongoose.Schema({ // create a schema for lecture that contains the following properties
    // title of the lecture which takes string value and must be given
    lectureTitle: {
        type: String,
        required: true
    },
    // URL of lecture video which takes string value
    videoUrl: {
        type: String
    },
    // boolean value telling whether this lecture can be seen for free as a preview or not
    isPreviewFree: {
        type: Boolean
    },
}, { timestamps: true }) // // store the time a document is added or updated in the collection

const Lecture = mongoose.model("Lecture", lectureSchema) // create a model named 'Lecture' with the lecture schema

export default Lecture // export the Lecture model
