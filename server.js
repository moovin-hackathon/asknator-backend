let http = require("http");
let Firebase = require("./Firebase");
let FirebaseDatabase = require("./FirebaseDatabase");
let express = require("express");
let app = express();

app.get('/', function (req, res) {
    res.send(FirebaseDatabase.test("teste"))
})

app.listen(8080, function () {
    console.log('olar')
})
