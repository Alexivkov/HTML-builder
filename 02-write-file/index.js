const fs = require('fs');
const path = require('path');
const { stdin: input, stdout: output, stdout } = require('process');
const readline = require('readline');
const rl = readline.createInterface({ input, output });
const fileDestination = path.join(__dirname,'hello.txt');
fs.WriteStream(fileDestination);
stdout.write('How do you do?\n');
rl.on('line', (answer) => {
  if(answer === 'exit') {
    rl.close();
    stdout.write('Bye bye!');
  } else {
    fs.appendFile(fileDestination, answer, function(error){
    if(error) throw error;
    });
  }
});

rl.on('SIGINT', () => {
  stdout.write('Bye bye!');
  rl.close();
});