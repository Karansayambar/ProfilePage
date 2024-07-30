// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBjaB4xQwyek6aQx04UoBj7Zhuz9JdevJU",
  authDomain: "profilepage-3d197.firebaseapp.com",
  projectId: "profilepage-3d197",
  storageBucket: "profilepage-3d197.appspot.com",
  messagingSenderId: "140662172518",
  appId: "1:140662172518:web:cc9674d0842b8ad79036a7",
  measurementId: "G-GCM98BXRNQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
