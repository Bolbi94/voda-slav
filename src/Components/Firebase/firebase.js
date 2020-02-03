import app from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyBmHWRpc7qgkSCoNLWEACa75WBMsGf4y0Q",
  authDomain: "stefi-isabella.firebaseapp.com",
  databaseURL: "https://stefi-isabella.firebaseio.com",
  projectId: "stefi-isabella",
  storageBucket: "stefi-isabella.appspot.com",
  messagingSenderId: "462372706903",
  appId: "1:462372706903:web:e14747079a00eff1"
}

export default class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
  }

  createUserWithEmailAndPassword = (email, password) => 
    this.auth.createUserWithEmailAndPassword(email, password);

  signInWithEmailAndPassword = (email, password) => 
    this.auth.signInWithEmailAndPassword(email, password);

  signOut = () => 
    this.auth.signOut();

  passwordReset = (email) => 
    this.auth.sendPasswordResetEmail(email);

  passwordUpdate = (password) => 
    this.auth.currentUser.updatePassword(password);
}