// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBsv9mUEDbtNup8q1il8cq2yT37XCvyHJ0",
  authDomain: "sovtmsvol-2bc33.firebaseapp.com",
  projectId: "sovtmsvol-2bc33",
  storageBucket: "sovtmsvol-2bc33.firebasestorage.app",
  messagingSenderId: "650112060949",
  appId: "1:650112060949:web:f8223f1801c6ca49fac81c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
