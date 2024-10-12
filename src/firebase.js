// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-5Tg3827Ij8TwGLAK634oPTBS3yuM5LA",
  authDomain: "project-rag-e5aed.firebaseapp.com",
  projectId: "project-rag-e5aed",
  storageBucket: "project-rag-e5aed.appspot.com",
  messagingSenderId: "633938051537",
  appId: "1:633938051537:web:c2fcb63ed63fee0f0be0f0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
