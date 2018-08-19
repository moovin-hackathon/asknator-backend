let firebase = require("./Firebase");

let database;

let data;

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

exports.login = (requestBody) => {
    return login(requestBody)
}

exports.registerUser = (requestBody) => {
    return registerUser(requestBody)
}

exports.getAvailableUser = (requestBody) => {
    return getAvailableUser(requestBody)
}

exports.getUserRecords = (requestBody) => {
    return getUserRecords(requestBody)
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

exports.finishConversation = (conversationId, requestBody) => {
    return finishConversation(conversationId, requestBody)
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

    reference.on("value", function(snapshot) {
        this.data = snapshot.val()
    }, function (errorObject) {
        return null;
    });

    if (this.data === undefined) {
        getDatabaseReference(referenceName).on("child_added", function(snapshot) {
            this.data = snapshot.child(id).val()
        })
    }
console.log(this.data)
    return this.data
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

    updateUserAvailability(requestBody.requestedId, false);

    reference = getDatabaseReference("conversations/");
    return reference.push(conversation);
}

function finishConversation(conversationId, requestBody) {
    reference = getDatabaseReference("conversations/" + conversationId)

    updateUserAvailability(reference.child('users').child('requested'), true);

    reference.child("status").set("inactive");
    reference.child("rating").set(requestBody.rating);
}

function newMessage(conversationId, requestBody) {
    let message = {
        'user': requestBody.userId,
        'message': requestBody.message
    };

    reference = getDatabaseReference("conversations/" + conversationId);
    reference.child('messages').push(message);
}

function login(requestBody) {
    let dataUser

    getDatabaseReference("users").on("value", function (snap) {
        snap.forEach(function (child) {
            if (child.val().email === requestBody.email && child.val().password === requestBody.password) {
                dataUser = child.val()
            }
        })
    })

    if (dataUser !== undefined) {
        updateUserAvailability(dataUser.key, true)
    }

    return dataUser
}

function registerUser(requestBody) {
    let dataUser = {
        email: requestBody.email,
        password: requestBody.password,
        name: requestBody.name,
        user_knowledge: requestBody.user_knowledge,
        gender: requestBody.gender,
        available: true
    }

    reference = getDatabaseReference()
    let userId = reference.child('users').push(dataUser)

    return userId.key
}

function updateUserAvailability(userId, is_available) {

    reference = getDatabaseReference("users/" + userId)
    reference.child("available").set(is_available);
}

function getAvailablleUser(getAvailableUser) {
    let dataUser;

    getDatabaseReference("users").on("value", function (snap) {
        snap.forEach(function (child) {
            let userHasKnowledge = false;
            child.val().user_knowledge.forEach(function (knowledge) {
                if (knowledge === requestBody.user_knowledge) {
                    userHasKnowledge = true;
                }
            })
            if (child.val().available === true && userHasKnowledge) {
                dataUser = child.val()
            }
        })
    })

    return dataUser
}

function getUserRecords(requestBody) {
    let userId = requestBody.id
    let conversationList
    getDatabaseReference("conversations").child("users").child("requested").orderByChild(userId).equalTo(userId).on('value', function (snapshot) {
        conversationList = snapshot.val()
    })

    return conversationList
}