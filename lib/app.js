var http = require('http'),
	fs = require('fs'),
	url = require('url'),
	WordCounter = require('./word_searcher');

function send404(response){

	response.writeHead(404, {"content-type": "text/plain"});
	response.end("Resource not found on the server..");
}
var server = http.createServer(function(request, response){

	var resource = url.parse(request.url).pathname;

	switch(resource){

		case '/':
			response.writeHead(200, {"content-type": "text/plain"});
			response.end("Hello world ..");
		break;

		case '/socket.html':
			fs.readFile('./public/socket.html', function(err, data){
				if(err) {
					send404(); 
					return ;
				}else {

					htmlData = data.toString();
					response.writeHead(200, {"content-type": "text/html"});
					response.end(data);
				}

			});
		break;

	}

}).listen(3005, function(){

	console.log("Server listening on port 3005..");
});

var io = require('socket.io')(server);

io.on('connection', function(socket){

	socket.emit('connDone', {message: "Socket connection established with the server.."});
	socket.on('myMess', function(data){
		console.log("Text to be searched on the server .."+data);
		var wordSearcher = new WordCounter('./public/myDir', data);

		wordSearcher.parseDir();

		wordSearcher.on('processingCompleted', function(report){

			socket.emit('report', report);
		});
	});
});
