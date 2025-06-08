import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
// Твои Firebase настройки
const firebaseConfig = {
  apiKey: "AIzaSyBdywZa4XpbkO80nZuBzl6XHDbqQMbw6A8",
  authDomain: "diploma-34c67.firebaseapp.com",
  projectId: "diploma-34c67",
  storageBucket: "diploma-34c67.appspot.com",
  messagingSenderId: "191734525876",
  appId: "1:191734525876:web:a194dbc99cb4e0a5304ce1",
  measurementId: "G-7P5491YN36",
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
