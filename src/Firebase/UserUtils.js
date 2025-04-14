import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut 
} from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => signInWithPopup(auth, provider);

export function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function resetPassword(emailAddress) {
  return sendPasswordResetEmail(auth, emailAddress);
}

export function signOut() {
  return firebaseSignOut(auth);
}