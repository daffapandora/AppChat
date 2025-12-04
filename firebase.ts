import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  CollectionReference,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCvFi2fXZQJD_d8ByLD76s17Xz8M7SQivI",
  authDomain: "aplikasi-chat-59dab.firebaseapp.com",
  projectId: "aplikasi-chat-59dab",
  storageBucket: "aplikasi-chat-59dab.firebasestorage.app",
  messagingSenderId: "257943606914",
  appId: "1:257943606914:web:a593db09c3b4aa57bd869b",
  measurementId: "G-1RZ49XTJ0N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export const messagesCollection = collection(
  db,
  'messages'
) as CollectionReference<DocumentData>;

export {
  auth,
  db,
  storage,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  ref,
  uploadBytes,
  getDownloadURL,
  Timestamp,
};

export type { User };
