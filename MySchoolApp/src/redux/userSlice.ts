import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state structure
interface UserState {
  isLoggedIn: boolean;
  id: string | null;
  refresh: string;
  access: string;
  role: string;
  username: string;
  phone: string;
  address: string;
  date_of_birth: string;
  gender: string;
  parents: string;
  class: Record<string, any>;
  classes: { id: string; name: string }[];
  subjects: string[];
  email: string;
  first_name: string;
  last_name: string;
  date_of_joining: string;
  class_teacher: Record<string, any>;
  selectedClass: string;
  selectedSubject: string;
  chatSocketUrl: string;
  selectedClassID: string;
}

const initialState: UserState = {
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
  classes: [],
  subjects: [],
  email: "",
  first_name: "",
  last_name: "",
  date_of_joining: "",
  class_teacher: {},
  selectedClass: "",
  selectedSubject: "",
  chatSocketUrl: "",
  selectedClassID: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoginDetails(
      state,
      action: PayloadAction<{
        id: string;
        refresh: string;
        access: string;
        role: string;
        username: string;
        phone: string;
        address: string;
        date_of_birth: string;
        gender: string;
        parents: string;
        class: Record<string, any>;
        classes: { id: string; name: string }[];
        subjects: string[];
        email: string;
        first_name: string;
        last_name: string;
        date_of_joining: string;
        class_teacher: Record<string, any>;
      }>
    ) {
      const {
        id,
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
        date_of_joining,
        class_teacher,
      } = action.payload;

      state.isLoggedIn = true;
      state.id = id;
      state.refresh = refresh;
      state.access = access;
      state.role = role;
      state.username = username;
      state.phone = phone;
      state.address = address;
      state.date_of_birth = date_of_birth;
      state.gender = gender;
      state.parents = parents;
      state.class = userClass;
      state.classes = classes;
      state.subjects = subjects;
      state.email = email;
      state.first_name = first_name;
      state.last_name = last_name;
      state.date_of_joining = date_of_joining;
      state.class_teacher = class_teacher;
    },

    logoutUser(state) {
      Object.assign(state, initialState);
    },

    setSelectedClass(state, action: PayloadAction<{ className: string }>) {
      state.selectedClass = action.payload.className;
    },

    setSelectedSubject(state, action: PayloadAction<{ subjectId: string }>) {
      state.selectedSubject = action.payload.subjectId;
    },

    setSelectedClassId(state, action: PayloadAction<{ classId: string }>) {
      state.selectedClassID = action.payload.classId;
    },
  },
});

export const { setLoginDetails, logoutUser, setSelectedClass, setSelectedSubject, setSelectedClassId } =
  userSlice.actions;
export default userSlice.reducer;
