import { createSlice } from '@reduxjs/toolkit'


const initialState = { 
    user:{},
    
    phone: false,
    address: '',
    date_of_birth:'',
    parents:'',
    
    // userDetails:{},
}

const userSlice = createSlice({
  name: 'studentdetails',
  initialState: initialState,

  reducers: {
    setStudentDetails(state,action){
      const {user,phone,address,date_of_birth,parents} = action.payload
      return {
          ...state,
          user: user,
          phone:phone,
          address:address,
          date_of_birth:date_of_birth,
          parents:parents
        }
    },
  },
})


export const{ setStudentDetails } = userSlice.actions
export default userSlice.reducer