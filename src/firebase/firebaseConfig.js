import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCDZZYfKf8tCnkEj4-wYU5P-DwiWNgWYww",
  authDomain: "ibs4-8bd5d.firebaseapp.com",
  projectId: "ibs4-8bd5d",
  storageBucket: "ibs4-8bd5d.appspot.com",
  messagingSenderId: "46359402035",
  appId: "1:46359402035:web:678f7bb02e09ea578fb546",
  measurementId: "G-1K229D21C0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
