import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyD0avyqLWPKEc9bTNOTFyW7c5XvgQCvgB8",
  authDomain: "lebanana-516e9.firebaseapp.com",
  databaseURL: "https://lebanana-516e9-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "lebanana-516e9",
  storageBucket: "lebanana-516e9.appspot.com",
  messagingSenderId: "667103125086",
  appId: "1:667103125086:web:177a538523e90c4b7d1ecf",
  measurementId: "G-DXX18WPNV7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Removed the unused analytics variable
export const auth = getAuth(app); // Added app as an argument
export default app


