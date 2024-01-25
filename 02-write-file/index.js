const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const inputPrompt = 'Enter text (press Ctrl + C or type "exit" to exit): ';

const handleExit = () => {
  console.log('\nFarewell! Exiting the program.');
  writeStream.end();
  rl.close();
};

const writeStream = fs.createWriteStream(filePath);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt(inputPrompt);
rl.prompt();

rl.on('line', (line) => {
  if (line.toLowerCase() === 'exit') {
    handleExit();
  } else {
    writeStream.write(`${line}\n`);
    rl.prompt();
  }
});

rl.on('SIGINT', handleExit);
