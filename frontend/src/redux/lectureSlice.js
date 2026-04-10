import { createSlice } from "@reduxjs/toolkit";

const lectureSlice = createSlice({ // create a slice called 'lectureSlice' to create and manage states and reducers related to lectures
    name: "lecture", // name of this slice will be 'lecture'
    initialState: { // this slice contains the following state with initial value
        lectureData: [] // array called 'lectureData' to store data of a lecture
    },
    reducers: {
        setLectureData: (state, action) => {
            state.lectureData = action.payload
        }
    }
});

export const { setLectureData } = lectureSlice.actions;
export default lectureSlice.reducer;