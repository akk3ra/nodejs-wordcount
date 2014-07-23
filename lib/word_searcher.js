var fs = require('fs'),
	util = require('util'),
	events = require('events');

function send404(response){

	response.writeHead(404, {"content-type": "text/plain"});
	response.end("The director not found on the server...");

}
var WordSearcher = function(dir, text){
	this.dir = dir;
	this.text = text;
	this.tasks = [];
	this.completedTasks = 0;
	this.mapping = {};
}
util.inherits(WordSearcher, events.EventEmitter);

WordSearcher.prototype.parseDir = function(){

	var wordSearcher = this;
	console.log("Directory being searched -->>"+wordSearcher.dir);
	fs.readdir(wordSearcher.dir, function(err, files){

		if(err) {
			send404(response);
			return ;
		}

		for(var index in files) {

			var task = (function(file){
				console.log("File getting parsed -->>"+file);

				return function(){

					fs.readFile(file, function(err, data){
						var fileData = data.toString();
						var textArr = fileData.split(' ');
						console.log("textArr size-->>"+textArr.length);
						count = 0;
						for(var value in textArr){
							if(textArr[value] == wordSearcher.text){
								count ++;
							}
						}
						console.log("count-->>"+count);
						console.log("file-->>"+file);
						wordSearcher.countWordsInText(count, file);

					});
				}

			})(wordSearcher.dir+'/'+files[index]);
			wordSearcher.tasks.push(task);

		}

		for(var task in wordSearcher.tasks){

			wordSearcher.tasks[task]();

		}

	});

}
WordSearcher.prototype.countWordsInText = function(count, file){
	this.completedTasks+=1;
	this.mapping[file] = count;

	if(this.completedTasks == this.tasks.length){
		this.emit('processingCompleted', this.mapping);
	}
}



module.exports = exports = WordSearcher;