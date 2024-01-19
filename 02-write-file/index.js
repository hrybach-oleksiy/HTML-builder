const fs = require('fs');
const readline = require('readline');

const filePath = './02-write-file/output.txt';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const fileStream = fs.createWriteStream(filePath, { flags: 'a' });

console.log(
  'Welcome! Please enter text. Press "ctrl + c" or type "exit" to exit.',
);

const handleInput = () => {
  rl.question('> ', (input) => {
    if (input.toLowerCase() === 'exit') {
      console.log('Farewell! Exiting...');
      rl.close();
      fileStream.end();
      process.exit();
    }

    fileStream.write(input + '\n', (err) => {
      if (err) {
        console.error(`Error writing to file: ${err.message}`);
      } else {
        console.log('Text written to file.');
      }

      handleInput();
    });
  });
};

handleInput();
