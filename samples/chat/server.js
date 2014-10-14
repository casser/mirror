var http = require("http");
var ws = require("nodejs-websocket");
var fs = require("fs");

http.createServer(function (req, res) {
	fs.createReadStream("index.html").pipe(res);
}).listen(8080);

var server = ws.createServer(function (connection) {
	connection.on("text", function (str) {
		broadcast(str);
    });
	connection.on("close", function () {
		broadcast("end");
	});
});
server.listen(8081)

function broadcast(str) {
	server.connections.forEach(function (connection) {
		connection.sendText(str)
	})
}
