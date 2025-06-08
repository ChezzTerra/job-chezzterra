// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdywZa4XpbkO80nZuBzl6XHDbqQMbw6A8",
  authDomain: "diploma-34c67.firebaseapp.com",
  projectId: "diploma-34c67",
  storageBucket: "diploma-34c67.firebasestorage.app",
  messagingSenderId: "191734525876",
  appId: "1:191734525876:web:a194dbc99cb4e0a5304ce1",
  measurementId: "G-7P5491YN36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
