   import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth , createUserWithEmailAndPassword ,
    signInWithEmailAndPassword ,
    sendPasswordResetEmail,
    signOut
 } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
 const firebaseConfig = {
    apiKey: "AIzaSyBOA2oeTdDnOvpFrWSB1k1NgcSO-6lzyVk",
    authDomain: "compelet-web.firebaseapp.com",
    projectId: "compelet-web",
    storageBucket: "compelet-web.firebasestorage.app",
    messagingSenderId: "651739847727",
    appId: "1:651739847727:web:a814ee58564b3355293ada",
    measurementId: "G-Q1TZ6RW2SC"
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();


export {auth,createUserWithEmailAndPassword, getAuth , signInWithEmailAndPassword , signOut , sendPasswordResetEmail};