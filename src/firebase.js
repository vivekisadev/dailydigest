import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBl8T3GMdwrFxtNp_N_bnKF7UDHUaDxgrU",
  authDomain: "faang-tracker-4e3c3.firebaseapp.com",
  projectId: "faang-tracker-4e3c3",
  storageBucket: "faang-tracker-4e3c3.firebasestorage.app",
  messagingSenderId: "1038848815846",
  appId: "1:1038848815846:web:02a8011daae929d38b0127",
  measurementId: "G-4TKW1TPK5J"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
