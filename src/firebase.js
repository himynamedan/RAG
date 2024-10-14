// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "", //Put your firebase key here
  authDomain: "", //Put your firebase authentication domain here
  projectId: "", //Put your firebase project ID here
  storageBucket: "", //Put your storage bucket here
  messagingSenderId: "", //Put your messaging sender ID here
  appId: "" //Put your appID here
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
