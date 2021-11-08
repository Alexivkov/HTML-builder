const fs = require('fs');
const path =require('path');
const { stdout } = require('process');
let readableStream = fs.ReadStream(path.join(__dirname, 'text.txt'), 'utf8');
readableStream.on('data', function(chunk) { 
	stdout.write(chunk);
});