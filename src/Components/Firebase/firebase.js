import app from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyBrbNMXwOrljm_EJyxWWY8Fx_2YQdkeqto",
  authDomain: "voda-slav.firebaseapp.com",
  databaseURL: "https://voda-slav.firebaseio.com",
  projectId: "voda-slav",
  storageBucket: "voda-slav.appspot.com",
  messagingSenderId: "447205832578",
  appId: "1:447205832578:web:69b11a649da4662d86c19b",

  clientId: "447205832578-qa26mmfh3lmvokcosq4mlmh42oepitmk.apps.googleusercontent.com",

  scopes: [
    "https://www.googleapis.com/auth/gmail.readonly"
  ],
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"
  ]
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

  auth = () =>
    this.auth;

  getGoogleProviderID = () =>
    app.auth.GoogleAuthProvider.PROVIDER_ID;
}