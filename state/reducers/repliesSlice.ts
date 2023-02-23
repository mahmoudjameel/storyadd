import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Alert } from "react-native";
import { db } from "../../firebase";

interface replyProps {
  userId: string;
  commentId: string;
  reply: string;
  likes: any[];
  dislikes: any[];
}

export const loadreplies = createAsyncThunk(
  "loadreplies",
  async (commentId: string) => {
    try {
      const q = query(
        collection(db, "replies"),
        where("commentId", "==", commentId)
      );
      const querySnapshot = await getDocs(q);
      const promises = querySnapshot.docs.map(async (docs: any) => {
        const username = await (
          await getDoc(doc(db, "users", docs.data().replier))
        ).data().username;
        const avatar = await (
          await getDoc(doc(db, "users", docs.data().replier))
        ).data().avatar;
        return {
          ...docs.data(),
          id: docs.id,
          username: username,
          avatar: avatar,
        };
      });
      const result = await Promise.all(promises);
      return result;
    } catch (error: any) {
      return error;
    }
  }
);

export const addreplies = createAsyncThunk(
  "addreplies",
  async ({ reply, userId, commentId }: replyProps) => {
    try {
      const res = await addDoc(collection(db, "replies"), {
        reply: reply,
        replier: userId,
        commentId: commentId,
        timestamp: Date.now(),
        likes: [],
        dislikes: [],
        numOfComments: 0,
      });
      return res;
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("action failed please try again");
    }
  }
);

export const getreply = createAsyncThunk("getreply", async (replyId: any) => {
  try {
    const res = (await getDoc(doc(db, "replies", replyId))).data();
    return res;
  } catch (e) {
    console.error("Error adding document: ", e);
    Alert.alert("action failed please try again");
  }
});

export const addreplyLike = createAsyncThunk(
  "addreplyLike",
  async (replyLikesInfos: any) => {
    try {
      const res = await updateDoc(
        doc(db, "replies", replyLikesInfos.replyLikesData.replyId),
        {
          likes: replyLikesInfos.replyLikesArray,
        }
      );
      return res;
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("action failed please try again");
    }
  }
);

export const addreplyDislike = createAsyncThunk(
  "addreplyDislike",
  async (replyDislikesInfos: any) => {
    try {
      const res = await updateDoc(
        doc(db, "replies", replyDislikesInfos.replyDislikesData.replyId),
        {
          dislikes: replyDislikesInfos.replyDislikesArray,
        }
      );

      return res;
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("action failed please try again");
    }
  }
);

export const removereply = createAsyncThunk(
  "removereply",
  async (replyId: any) => {
    deleteDoc(doc(db, "replies", replyId));
  }
);

export interface repliesProps {
  repliesStates: {
    result: any[];
    reply: string;
    replier: string;
    timestamp: string;
    likes: any[];
    dislikes: any[];
    replyLiked: boolean;
    replyDisliked: boolean;
    cleanArray: any[];
  };
}

export const repliesInitialState = {
  result: [],
  reply: "",
  replier: "",
  timestamp: "",
  likes: [],
  dislikes: [],
  replyLiked: false,
  replyDisliked: false,
  cleanArray: [],
};

export const repliesSlice = createSlice({
  name: "replies-redux",
  initialState: repliesInitialState,
  reducers: {
    isreplyLiked: (state, action) => {
      state.replyLiked = action.payload;
    },
    isreplyDisliked: (state, action) => {
      state.replyDisliked = action.payload;
    },
    cleanArray: (state, action) => {
      state.likes.pop();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadreplies.fulfilled, (state, action: any) => {
      state.result = action.payload;
    });
    builder.addCase(getreply.fulfilled, (state, action) => {
      state.likes = action.payload.likes;
      state.dislikes = action.payload.dislikes;
    });
  },
});

export const getrepliesData = (state: repliesProps) => state.repliesStates;
export const { isreplyLiked, isreplyDisliked } = repliesSlice.actions;
export default repliesSlice.reducer;
