import { createSlice } from '@reduxjs/toolkit';
export const counterSlice = createSlice({
  name: 'storeManage',
  initialState: {
    jwt: 'null',
    user: 'null',
    notification: [],
    courses: [],
  },
  reducers: {
    updateJwt: (state, action) => {
      state.jwt = action.payload;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    updateNotification: (state, action) => {
      state.notification = action.payload;
    },
    updateCourses: (state, action) => {
      state.courses = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateJwt, updateUser, updateNotification, updateCourses } = counterSlice.actions;

export default counterSlice.reducer;
