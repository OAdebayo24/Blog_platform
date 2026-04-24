import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDDv1lypwMjICaOQ6VJXHKkryAtm5bGLbA",
  authDomain: "blog-platform-f9b8b.firebaseapp.com",
  projectId: "blog-platform-f9b8b",
  storageBucket: "blog-platform-f9b8b.firebasestorage.app",
  messagingSenderId: "714902192682",
  appId: "1:714902192682:web:fa9939b89a72ed6ea83953",
  measurementId: "G-JKEJ0S2PWJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const blogDb = getFirestore(app)
