import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state
interface UserState {
  isLoggedIn: boolean;
  classes: { id: string; name: string }[];
  selectedClass: string;
}

const initialState: UserState = {
  isLoggedIn: false,
  classes: [], // Store classes from API
  selectedClass: "", // User-selected class
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoginDetails(state, action: PayloadAction<{ classes: { id: string; name: string }[] }>) {
      return {
        ...state,
        classes: action.payload.classes, // Store classes from API
        isLoggedIn: true,
      };
    },
    setSelectedClass(state, action: PayloadAction<{ classId: string }>) {
      return {
        ...state,
        selectedClass: action.payload.classId,
      };
    },
  },
});

export const { setLoginDetails, setSelectedClass } = userSlice.actions;
export default userSlice.reducer;
