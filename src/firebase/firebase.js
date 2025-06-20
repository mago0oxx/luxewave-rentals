// firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCFezg8UP1UGAnOCyXPKhfZGKBx3GpxKP0",
  authDomain: "luxewave-rentals.firebaseapp.com",
  projectId: "luxewave-rentals",
  storageBucket: "luxewave-rentals.appspot.com",
  messagingSenderId: "548458128137",
  appId: "1:548458128137:web:4bb3b7ad0bbfac521429d8",
  measurementId: "G-N15H90WG1C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
