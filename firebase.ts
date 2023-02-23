// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAjhvbd7JmMGfBUECzUbm7c4JNqVTjHi2g",
  authDomain: "storyat-373416.firebaseapp.com",
  projectId: "storyat-373416",
  storageBucket: "storyat-373416.appspot.com",
  messagingSenderId: "1021244246830",
  appId: ":1021244246830:web:de6d4db6738c46ebc708bf",
  measurementId: "G-KQV84GR5TX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const googleProvider = new GoogleAuthProvider();

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);

export default app;
