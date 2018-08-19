let firebase = require("./Firebase");

let authentication;

exports.authentication = connectAuthentication();

exports.login = (requestBody) => {
    return login(requestBody)
}

function connectAuthentication() {
    authentication = firebase.firebaseReference().auth();
}

function login(requestBody) {
    let token = false
    try {
        token = authentication.signInWithEmailAndPassword(requestBody.email, requestBody.password).then((user) => {
            console.log(user)
        })
    } catch (error) {
        console.log(error.toString())
    }

    console.log(token)
}