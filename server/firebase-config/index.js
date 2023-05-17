// const { auth, db, RecaptchaVerifier, signInWithPhoneNumber, updateEmail, updateProfile, signOut, getFirestore, collection, getDocs, doc, setDoc, query, orderBy } = require("./firebase-config/index");
//import { auth, db, RecaptchaVerifier, signInWithPhoneNumber, updateEmail, updateProfile, signOut, getFirestore, collection, getDocs, doc, setDoc, query, orderBy } from "./firebase-config/index.js";


const { initializeApp, firebase } = require("firebase/app");
const { getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateEmail,
  updateProfile,
  signOut
} = require("firebase/auth");
const { doc, setDoc, getFirestore, collection, getDocs, query, orderBy } = require("firebase/firestore") ;
// import { initializeApp } from "firebase/app";
// import { getAuth,
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
//   updateEmail,
//   updateProfile,
//   signOut
// } from "firebase/auth";
// import { doc, setDoc, getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyCsRWt3e5ZsgaLDybCAolXgR8rRFrTxV_M",
    authDomain: "mat-vote-app.firebaseapp.com",
    projectId: "mat-vote-app",
    storageBucket: "mat-vote-app.appspot.com",
    messagingSenderId: "147812523519",
    appId: "1:147812523519:web:6587e52f05afe4234bdbca",
    measurementId: "G-0HMKP9GRYL"
  };
  firebase.initializeApp(firebaseConfig);
const appx = initializeApp(firebaseConfig);
const auth = getAuth(appx);
const db = firebase.firestore();

auth.languageCode = "tr";

module.exports = {auth: function(){}, db: function(){}, RecaptchaVerifier: function(){}, signInWithPhoneNumber: function(){}, 
updateEmail: function(){}, updateProfile: function(){}, signOut: function(){}, getFirestore: function(){}, collection: function(){}, 
getDocs: function(){}, doc: function(){}, setDoc: function(){}, query: function(){}, orderBy: function(){}}
 