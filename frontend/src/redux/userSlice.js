import { createSlice } from "@reduxjs/toolkit"; // import 'createSlice' function from 'react-redux-toolkit' lirary to create a redux slice containing state variables and reducers/functions to manage their values

const userSlice = createSlice({ // create a slice called 'userSlice' to create and manage states and reducers related to users
    name: "user", // name of this slice will be 'user'
    initialState: { // this slice contains the following state with initial value
        userData: null // object called 'userData' to store data of a user
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload
        }
    }
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;