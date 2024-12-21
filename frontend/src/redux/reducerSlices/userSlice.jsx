import { createSlice } from "@reduxjs/toolkit";
// import userSlice from '../redux/reducerSlices/userSlice';

// Initial state based on the structure of the response data
const initialState = {
  isLoggedIn: false,
  id: null,
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
  class_teacher:{},
  selectedClass: "", // New state to store the selected class
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setLoginDetails(state, action) {
      const {
        id, // Include ID from backend response
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
        id, // Store user ID
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
    setSelectedClass(state, action) {
      const {className} = action.payload
      return{
        ...state,
        selectedClass:className
      }
    }
  },
});

export const { setLoginDetails, logoutUser,setSelectedClass } = userSlice.actions;
export default userSlice.reducer;