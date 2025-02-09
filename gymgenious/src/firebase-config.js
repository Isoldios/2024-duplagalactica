
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCsYKBhYS8TCuF5gdRilkSKzLiWGvmLDfc",
  authDomain: "pid-e18e4.firebaseapp.com",
  projectId: "pid-e18e4",
  storageBucket: "pid-e18e4.firebasestorage.app",
  messagingSenderId: "791001844484",
  appId: "1:791001844484:web:10c4fd6fca13524760de51",
  measurementId: "G-0B1RZE1Q2N"
};



const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const firestore = getFirestore(app);
const auth = getAuth(app);
export { app, firestore,auth};
