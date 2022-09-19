import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
// Follow this pattern to import other Firebase services

const firebaseConfig = {
  apiKey: "AIzaSyBf2inH_lHHwwBbgWyhuH4Yiz_spn1bg3w",
  authDomain: "react-firebase-5fcda.firebaseapp.com",
  projectId: "react-firebase-5fcda",
  storageBucket: "react-firebase-5fcda.appspot.com",
  messagingSenderId: "318206401481",
  appId: "1:318206401481:web:bf74ffe49a8ab79fe52618",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// All Collections refs
// export const booksCollection = doc(db, "books");

//My Functions
// const booksCollectionRef = collection(db, "books");

//POST
export const create = (collectionRef, obj) => {
  return addDoc(collection(db, collectionRef), obj);
};

//GET
export const get = async (collectionRef, id) => {
  const docRef = doc(db, collectionRef, id);
  const docSnap = await getDoc(docRef);
  console.log(docSnap);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
};

//PUT
export const update = (collectionRef, id, book) => {
  const bookRef = doc(db, collectionRef, id);
  return updateDoc(bookRef, book);
};

//DELETE
export const remove = (collectionRef, id) => {
  return deleteDoc(doc(db, collectionRef, id));
};

//GET
export const search = async (collectionRef) => {
  let arr = [];
  const querySnapshot = await getDocs(collection(db, collectionRef));
  console.log(querySnapshot);
  querySnapshot.docs.forEach((doc) => {
    arr.push({ id: doc.id, ...doc.data() });
  });
  return arr;
};
