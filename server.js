let Firebase = require("./Firebase");
let FirebaseDatabase = require("./FirebaseDatabase");
let express = require("express");
let cors = require("cors")
let app = express();

const bodyParser = require("body-parser")

// User Register
app.use(bodyParser.json());
app.use(cors())
app.post('/user/register', function (request, response) {
    let userData = FirebaseDatabase.registerUser(request.body)

    if (userData === undefined) {
        response.status(400)
    }

    response.send(userData)
})

// Login
app.use(bodyParser.json());
app.post('/user/login', function (request, response) {
    let dataUser = FirebaseDatabase.login(request.body)

    response.send(dataUser)
})

//UserAvailable
app.use(bodyParser.json());
app.get('/user/getAvailableUser', function (request, response) {
    let dataUser = FirebaseDatabase.getAvailableUser(request.body)

    if (dataUser === undefined) {
        response.status(400)
    }

    response.send(dataUser)
})

//UserRecords
app.use(bodyParser.json());
app.get('/user/:id/conversation/', function (request, response) {
    let dataUser = FirebaseDatabase.getUserRecords(request.params)

    if (dataUser === undefined) {
        response.status(400)
    }

    response.send(dataUser)
})

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
app.get('/conversation/:id', function (request, response, next) {

    request.header("Access-Control-Allow-Origin", "*");
    request.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    conversation = FirebaseDatabase.findById("conversations", request.params.id)

    if (conversation === undefined) {
        response.status(400);
    }

    response.send(conversation)
})

app.post('/conversation/:id/finish', function (request, response) {
    response.send(FirebaseDatabase.finishConversation(request.params.id, request.body))
})

server = app.listen(8080)
const io = require("socket.io")(server)

io.on('connection', function(socket){
    socket.on('chat_message', function(message){

        messageObj = JSON.parse(message)
        console.log(messageObj.userId);
        FirebaseDatabase.newMessage(messageObj.conversationId, {
            userId: messageObj.userId,
            message: messageObj.message
        })

        conversation = FirebaseDatabase.findById("conversations", messageObj.conversationId)
console.log("conv")
console.log(conversation)
        if (conversation !== undefined) {
            socket.emit('return_message', JSON.stringify(conversation))
        }

    });
});
