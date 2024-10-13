import { createSlice } from '@reduxjs/toolkit'

const initialState = { 
    isLoggedIn: false,
    access: '',
    role:'',

    // userDetails:{},
}

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
   setLoginDetails(state,action){
    const {role,access,username} = action.payload
return {
    ...state,
    isLoggedIn: true,
    access:access,
    role:role,
    username:username
       }
   }




  },
})

export const{ setLoginDetails } = userSlice.actions
export default userSlice.reducer