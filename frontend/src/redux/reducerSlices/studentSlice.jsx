import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  refresh: "",
  access: "",
  role: "",
  username: "",
  phone: "",
  address: "",
  data_of_birth: "",
  gender: "",
  parents: "",
  // class: {},
  subjects: [],
  email: "",
  first_name: "",
  last_name: "",

  // userDetails:{},
};

const userSlice = createSlice({
  name: "studentdetails",
  initialState: initialState,

  reducers: {
    setStudentDetails(state, action) {
      const { refresh,access,username,phone,address,data_of_birth,gender,parents, subjects,email,first_name,last_name } = action.payload;
      return {
        ...state,
        refresh:refresh,
        access:access,
        username:username,
        phone:phone,
        address:address,
        data_of_birth:data_of_birth,
        gender:gender,
        parents:parents,
        subjects:subjects,
        email:email,
        first_name:first_name,
        last_name:last_name
      };
    },
  },
});

export const { setStudentDetails } = userSlice.actions;
export default userSlice.reducer;
