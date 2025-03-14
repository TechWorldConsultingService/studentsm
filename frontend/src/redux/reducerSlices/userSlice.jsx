import { createSlice } from "@reduxjs/toolkit";

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
  selectedClassName: "", 
  selectedSubject:"",
  chatSocketUrl: "", // WebSocket connection URL
  selectedClassID: "",
  selectedSubjectName:""
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
        date_of_joining,
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
    
    setSelectedClass: (state, action) => {
      state.selectedClassName = action.payload;
    },

    setSelectedSubject(state,action) {
        state.selectedSubject = action.payload
    },
    setSelectedSubjectName(state,action) {
      state.selectedSubjectName = action.payload
  },
    setSelectedClassId:  (state,action) => {
        state.selectedClassID =action.payload
    }
    
  },
});

export const { setLoginDetails, logoutUser,setSelectedClass, setSelectedSubject, setSelectedClassId,setSelectedSubjectName } = userSlice.actions;
export default userSlice.reducer;