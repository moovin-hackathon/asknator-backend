let admin = require("firebase-admin");
// let firebase = require("firebase")
let serviceAccount = require("./accountCredentials.json");

let firebaseInstance;

exports.firebaseReference = () => {
    firebaseInstance = getFirebase();
    return firebaseInstance
}

function connectFirebase() {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://asknator-9df11.firebaseio.com"
    });

    firebaseInstance = admin
}

function getFirebase() {
    if (firebaseInstance === undefined) {
        connectFirebase();
    }
    return firebaseInstance;
}
