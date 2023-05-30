const { initializeApp, firebase } = require("firebase/app");
const { doc, setDoc, getFirestore, collection, getDocs, query, orderBy, where } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCsRWt3e5ZsgaLDybCAolXgR8rRFrTxV_M",
  authDomain: "mat-vote-app.firebaseapp.com",
  projectId: "mat-vote-app",
  storageBucket: "mat-vote-app.appspot.com",
  messagingSenderId: "147812523519",
  appId: "1:147812523519:web:6587e52f05afe4234bdbca",
  measurementId: "G-0HMKP9GRYL"
};
const appx = initializeApp(firebaseConfig);
const db = getFirestore(appx);

module.exports = {
  db, getFirestore, collection,
  getDocs, doc, setDoc, query, orderBy, where
}