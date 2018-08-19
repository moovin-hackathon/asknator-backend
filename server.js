let http = require("http");
let Firebase = require("./Firebase");
let FirebaseDatabase = require("./FirebaseDatabase");

FirebaseDatabase.save("teste", {teste5: "bombou tbm"});

// //
// http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/json'});
//     res.end(JSON.stringify(data));
// }).listen(8080);