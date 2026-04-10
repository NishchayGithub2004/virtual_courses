import { createSlice } from "@reduxjs/toolkit";

const reviewSlice = createSlice({ // create a slice called 'reviewSlice' to create and manage states and reducers related to reviews
    name: "review", // name of this slice will be 'review'
    initialState: { // this slice contains the following state with initial value
        allReview: [] // array called 'allReview' to store data of all reviews
    },
    reducers: {
        setAllReview: (state, action) => {
            state.allReview = action.payload
        }
    }
});

export const { setAllReview } = reviewSlice.actions;
export default reviewSlice.reducer;