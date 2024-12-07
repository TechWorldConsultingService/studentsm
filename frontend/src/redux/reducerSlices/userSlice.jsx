import { createSlice } from "@reduxjs/toolkit";

// Initial state based on the structure of the response data
const initialState = {
  isLoggedIn: false,
  refresh: "",
  access: "",
  role: "",
  username: "",
  phone: "",
  address: "",
  date_of_birth: "",
  gender: "",
  parents: "",
  class: {},
  classes:[],
  subjects: [],
  email: "",
  first_name: "",
  last_name: "",
  date_of_joining:"",
  class_teacher:{}
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setLoginDetails(state, action) {
      const {
        refresh,
        access,
        role,
        username,
        phone,
        address,
        date_of_birth,
        gender,
        parents,
        class: userClass,
        classes,
        subjects,
        email,
        first_name,
        last_name,
        class_teacher,
        date_of_joining
      } = action.payload;

      return {
        ...state,
        refresh,
        access,
        role,
        username,
        phone,
        address,
        date_of_birth,
        gender,
        parents,
        class: userClass, // Map class to state
        classes, 
        subjects,
        email,
        first_name,
        last_name,
        class_teacher,
        date_of_joining,
        isLoggedIn: true, 
      };
    },

    logoutUser() {
      return initialState; 
    },
  },
});

export const { setLoginDetails, logoutUser } = userSlice.actions;
export default userSlice.reducer;