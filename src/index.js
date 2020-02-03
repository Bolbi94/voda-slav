import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';
import Firebase, { FirebaseContext } from './Components/Firebase'

ReactDOM.render(
  <FirebaseContext.Provider value = {new Firebase()}>
    <App />
  </FirebaseContext.Provider>, 
  document.getElementById('root')
);

/*
<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="/__/firebase/7.7.0/firebase-app.js"></script>

<!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->

<!-- Initialize Firebase -->
<script src="/__/firebase/init.js"></script>
*/
