import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Alert } from "react-native";

import { auth, db } from "../../firebase";

interface valueProps {
  email: string;
  password: string;
  provider?: GoogleAuthProvider;
  useremail?: string;
  username?: string;
  userimage?: string;
}

export const updateUserImage = createAsyncThunk(
  "updateUserImage",
  async (userImageInfos: any) => {
    try {
      const res = await updateDoc(doc(db, "users", userImageInfos.userId), {
        avatar: userImageInfos.userImage,
      });
      return res;
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("action failed please try again");
    }
  }
);

export const getUser = createAsyncThunk("getUser", async (userId: any) => {
  try {
    const res = await getDoc(doc(db, "users", userId));
    return { ...res.data(), id: res.id };
  } catch (e) {
    console.error("Error adding document: ", e);
    Alert.alert("action failed please try again");
  }
});

export const updateUsername = createAsyncThunk(
  "updateUsername",
  async ({ userId, username }: any) => {
    try {
      const res = await updateDoc(doc(db, "users", userId), {
        username: username,
      });
      return res;
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("action failed please try again");
    }
  }
);

export const registerUser = createAsyncThunk(
  "registerUser",
  async ({ email, password }: valueProps) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      return res.user;
    } catch (error: any) {
      return error;
    }
  }
);

export const loginUser = createAsyncThunk(
  "loginUser",
  async ({ email, password, provider }: valueProps) => {
    if (provider) {
      try {
        const res = await signInWithPopup(auth, provider);
        return res.user;
      } catch (error: any) {
        return error;
      }
    } else {
      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        return res.user;
      } catch (error: any) {
        return error;
      }
    }
  }
);

export const resetPassword = createAsyncThunk(
  "resetPassword",
  async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      return error;
    }
  }
);

export interface userProps {
  authUser: {
    uid: string;
    email: string;
    password: string;
    // confirmPassword: string;
    err: { code: string; message: string };
    user: any;
    newuser: any;
    image: string;
    username: string;
  };
}

export const userInitialState = {
  uid: "",
  email: "",
  password: "",
  err: { code: "", message: "" },
  user: "",
  newuser: "",
  image: "",
  username: "",
};

export const authSlice = createSlice({
  name: "user-redux",
  initialState: userInitialState,
  reducers: {
    updateError: (state, action) => {
      state.err.message = action.payload;
    },
    saveUser: (state, action) => {
      state.user = action.payload;
    },
    resetUser: (state, action) => {
      state.user = "";
    },
    updateUserImageState: (state, action) => {
      state.image = action.payload;
    },
    updateUsernameState: (state, action) => {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.fulfilled, (state, action: any) => {
      state.email = action.payload.email;
      state.err.code = action.payload.code;
      state.err.message = action.payload.message;
    });

    builder.addCase(loginUser.fulfilled, (state, action: any) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.err.code = action.payload.code;
      state.err.message = action.payload.message;
    });
    builder.addCase(getUser.fulfilled, (state, action: any) => {
      state.newuser = action.payload;
    });
  },
});

export const getAuthData = (state: userProps) => state.authUser;
export const {
  updateError,
  saveUser,
  resetUser,
  updateUserImageState,
  updateUsernameState,
} = authSlice.actions;
export default authSlice.reducer;
