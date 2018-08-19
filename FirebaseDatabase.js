let firebase = require("./Firebase");

let database;

exports.database = connectDatabase();

exports.databaseReference = (name) => {
    return getDatabaseReference(name)
}

exports.save = (referenceName, data) => {
    return save(referenceName, data)
}

exports.test = (referenceName) => {
    refTeste = database.ref(referenceName);
    refTeste.on("value", function(snapshot) {
        data = snapshot.val()
        console.log(data);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    return data;
}

function connectDatabase() {
    database = firebase.firebaseReference().database();
}

function getDatabaseReference(name) {
    return database.ref(name);
}

function save(referenceName, data) {
    reference = getDatabaseReference(referenceName);
    reference.push(data);
}
