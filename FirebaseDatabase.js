let firebase = require("./Firebase");

let database;

exports.database = connectDatabase();

exports.databaseReference = (name) => {
    return getDatabaseReference(name)
}

exports.save = (referenceName, data) => {
    return save(referenceName, data)
}

exports.findById = (referenceName, id) => {
    return findById(referenceName, id)
}

exports.createConversation = (applicantId, requestedId) => {
    return createConversation(applicantId, requestedId)
}

exports.newMessage = (conversationId, requestBody) => {
    return newMessage(conversationId, requestBody)
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

function findById(referenceName, id) {
    reference = getDatabaseReference(referenceName + "/" + id)

    let data

    reference.on("value", function(snapshot) {
        data = snapshot.val()
    }, function (errorObject) {
        return null;
    });

    return data
}

function createConversation(requestBody) {

    let conversation = {
        'created_time': Date.now(),
        'users': {
            'applicant' : requestBody.applicantId,
            'requested' : requestBody.requestedId
        },
        'status': 'active',
        'subject': requestBody.subject
    };

    reference = getDatabaseReference("conversations/");
    return reference.push(conversation);
}

function newMessage(conversationId, requestBody) {
    let message = {
        'user': requestBody.userId,
        'message': requestBody.message
    };

    reference = getDatabaseReference("conversations/" + conversationId);
    reference.child('messages').push(message);
}