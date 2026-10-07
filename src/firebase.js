import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDg2p0vN5ydfVwxtG4t6p0fkdyCv6Tc1dA",
  authDomain: "campus-3607d.firebaseapp.com",
  projectId: "campus-3607d",
  storageBucket: "campus-3607d.firebasestorage.app",
  messagingSenderId: "517105149734",
  appId: "1:517105149734:web:d3364395e695e8f98a03e7",
  measurementId: "G-XKPY53E5C0"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);