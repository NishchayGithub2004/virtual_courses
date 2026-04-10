import { configureStore } from "@reduxjs/toolkit"; // import 'configureStore' function from 'react-redux-toolkit' library to create and configure a redux store
// import all slices from their respective files to combine them into a single store
import userSlice from "./userSlice";
import courseSlice from "./courseSlice";
import lectureSlice from "./lectureSlice";
import reviewSlice from "./reviewSlice";

// create and export a redux store called 'store' and configure it using 'configureStore' function by providing it all slices in it's 'reducer' property with different names
export const store = configureStore({
    reducer: {
        user: userSlice,
        course: courseSlice,
        lecture: lectureSlice,
        review: reviewSlice
    }
});