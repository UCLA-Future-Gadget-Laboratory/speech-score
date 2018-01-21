// Uploads the json data to Firebase RTD

// <script src="https://www.gstatic.com/firebasejs/4.9.0/firebase.js"></script>
// <script>
//   // Initialize Firebase
//   var config = {
//     apiKey: "AIzaSyCsgK_msaA1GXmYQYrZBO4vIje4gUGbrlE",
//     authDomain: "sbhacks-1516442289825.firebaseapp.com",
//     databaseURL: "https://sbhacks-1516442289825.firebaseio.com",
//     projectId: "sbhacks-1516442289825",
//     storageBucket: "sbhacks-1516442289825.appspot.com",
//     messagingSenderId: "203547820043"
//   };
//   firebase.initializeApp(config);
// </script>

var admin = require('firebase-admin');

var serviceAccount = require('/home/haoyu/Desktop/SBHacks2018/SBHacks-c18839cd7d0f.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sbhacks-1516442289825.firebaseio.com",
});