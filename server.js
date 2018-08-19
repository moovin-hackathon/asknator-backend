let Firebase = require("./Firebase");
let FirebaseDatabase = require("./FirebaseDatabase");
let express = require("express");
let app = express();

const bodyParser = require("body-parser")

// New message
app.use(bodyParser.json());
app.post('/conversation/:id/message', function (request, response) {
    FirebaseDatabase.newMessage(request.params.id, request.body)
})

// Create conversation
app.use(bodyParser.json());
app.post('/conversation', function (request, response) {
    response.send(FirebaseDatabase.createConversation(request.body).key)
})

// Return conversation
app.get('/conversation/:id', function (request, response) {
    conversation = FirebaseDatabase.findById("conversations", request.params.id)

    if (conversation === undefined) {
        response.status(400);
    }

    response.send(conversation)
})

app.listen(8080, function () {
    console.log('teste')
})
