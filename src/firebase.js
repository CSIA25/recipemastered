// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDEF5zKukSLXb4Ae9SsPrV_5ovuXpANNIk",
  authDomain: "recipefinder-c4e95.firebaseapp.com",
  projectId: "recipefinder-c4e95",
  storageBucket: "recipefinder-c4e95.appspot.com",
  messagingSenderId: "286947348570",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Authentication
export const auth = getAuth(app);
