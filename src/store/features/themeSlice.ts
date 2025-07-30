import { createAppSlice } from "../app/createAppSlice";

const initialState = {
    theme: "light",
}

const themeSlice = createAppSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
    },
    selectors: {
        getTheme: state => state?.theme,
    },
});


export default themeSlice.reducer;

export const { setTheme } = themeSlice.actions;

export const { getTheme } = themeSlice.selectors;