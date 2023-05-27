const { initializeApp } = require("firebase/app");
const { getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateEmail,
  updateProfile,
  signOut
} = require("firebase/auth");

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
const auth = getAuth(appx);

auth.languageCode = "tr";

module.exports = {
  auth, RecaptchaVerifier, signInWithPhoneNumber,
  updateEmail, updateProfile, signOut
}
