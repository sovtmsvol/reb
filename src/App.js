import React from "react";
import { db } from './firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect } from 'react';
import MainPage from "./components/MainPage";

function App() {
  return <MainPage />;
}

export default App;