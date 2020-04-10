import firebase from 'firebase'
var config = { /* COPY THE ACTUAL CONFIG FROM FIREBASE CONSOLE */
      apiKey: "AIzaSyD3Xw8pmtDoL-IqGHU9r7YEtIlsEr-sFa4",
      authDomain: "mydatabase-c9b84.firebaseapp.com",
      databaseURL: "https://mydatabase-c9b84.firebaseio.com",
      projectId: "mydatabase-c9b84",
      storageBucket: "mydatabase-c9b84.appspot.com",
      messagingSenderId: "591007422584"
    };
firebase.initializeApp(config);
export default firebase;