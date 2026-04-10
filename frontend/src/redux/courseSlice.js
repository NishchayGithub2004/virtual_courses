import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({ // create a slice called 'courseSlice' to create and manage states and reducers related to courses
    name: "course", // name of this slice will be 'course'
    initialState: { // this slice contains the following states with initial values
        creatorCourseData: [], // array called 'creatorCourseData' to store data of courses created by the user
        courseData: [], // array called 'courseData' to store data of a course
        selectedCourseData: null // object called 'selectedCourseData' to store data of the selected course
    },
    reducers: {
        setCreatorCourseData: (state, action) => {
            state.creatorCourseData = action.payload
        },
        setCourseData: (state, action) => {
            state.courseData = action.payload
        },
        setSelectedCourseData: (state, action) => {
            state.selectedCourseData = action.payload
        }
    }
});

export const { setCreatorCourseData } = courseSlice.actions;
export const { setCourseData } = courseSlice.actions;
export const { setSelectedCourseData } = courseSlice.actions;
export default courseSlice.reducer;