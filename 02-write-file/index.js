const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const inputPrompt = 'Enter text (press Ctrl + C or type "exit" to exit): ';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const writeToFile = (text) => {
  fs.appendFile(filePath, `${text}\n`, (err) => {
    if (err) {
      console.error(`Error writing to file: ${err.message}`);
    }
  });
};

const handleExit = () => {
  console.log('\nFarewell! Exiting the program.');
  rl.close();
};

rl.question(inputPrompt, (input) => {
  writeToFile(input);

  rl.setPrompt(inputPrompt);
  rl.prompt();

  rl.on('line', (line) => {
    if (line.toLowerCase() === 'exit') {
      handleExit();
    } else {
      writeToFile(line);
      rl.prompt();
    }
  });

  rl.on('close', () => {
    handleExit();
  });
});
