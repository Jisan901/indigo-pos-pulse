import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: null,
};

const userInfoSlice = createSlice({
    name: "userInfo",
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.userInfo = action.payload;

        },
        logout: (state) => {
            state.userInfo = null;
        }
    },
    selectors: {
        getUser: state => state?.userInfo,
    },
});

export default userInfoSlice.reducer;
export const { addUser,logout } = userInfoSlice.actions;
export const { getUser } = userInfoSlice.selectors;