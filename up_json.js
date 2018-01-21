// Takes json file from Firebase and analyzes it

var admin = require('firebase-admin');

var serviceAccount = require('/home/haoyu/Desktop/SBHacks2018/SBHacks-c18839cd7d0f.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sbhacks-1516442289825.firebaseio.com",
});