const commandLineArgs = require('command-line-args');
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require("../client-secret.json");
const optionDefinitions = [
  { name: 'collection', alias: 'c', type: String }
];
const options = commandLineArgs(optionDefinitions, { partial: true });

if ((options._unknown) || (!options.collection)) {
  console.log('Usage: node watch.js -c|--collection <collection>');
  process.exit();
}

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
});

var db = firebaseAdmin.firestore();

console.log(`Watching "${options.collection}" for changes...`);
db.collection(options.collection)
    .onSnapshot(docSnapshot => {
        docSnapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
        });
    }, err => {
        console.log(`Encountered error: ${err}`);
});
