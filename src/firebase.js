import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCErl76aa_o_eME17SaHChe6P6AvS_TKMY',
  authDomain: 'think-piece-moalazzam.firebaseapp.com',
  databaseURL: 'https://think-piece-moalazzam.firebaseio.com',
  projectId: 'think-piece-moalazzam',
  storageBucket: 'think-piece-moalazzam.appspot.com',
  messagingSenderId: '791718176117',
  appId: '1:791718176117:web:6788001b17ffc6bbcc1f3c',
  measurementId: 'G-B23PK7P6TC',
};

firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();

export const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => auth.signInWithPopup(provider);
export const signOut = () => auth.signOut();

export const createUserProfileDocument = async (user, additionalData) => {
  if (!user) return;

  // Get a reference to the place in the database where a user profile might be.
  const userRef = firestore.doc(`users/${user.uid}`);

  // Go and fetch the document from that location.
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { displayName, email, photoURL } = user;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.error('Error creating user', error.message);
    }
  }

  return getUserDocument(user.uid);
};

export const getUserDocument = async (uid) => {
  if (!uid) return null;
  try {
    return firestore.collection('users').doc(uid);
  } catch (error) {
    console.error('Error fetching user', error.message);
  }
};

export default firebase;
