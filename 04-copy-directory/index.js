const fs = require('fs');
const path = require('path');

const sourceFolder = './04-copy-directory/files';
const destinationFolder = './04-copy-directory/files-copy';

const copyDir = (source, destination) => {
  // Read the contents of the source directory
  fs.readdir(source, (err, files) => {
    if (err) {
      console.error(`Error reading source directory: ${err.message}`);
      return;
    }

    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination);
    }

    files.forEach((file) => {
      const sourcePath = path.join(source, file);
      const destinationPath = path.join(destination, file);

      const readStream = fs.createReadStream(sourcePath);
      const writeStream = fs.createWriteStream(destinationPath);

      readStream.pipe(writeStream);

      readStream.on('error', (error) => {
        console.error(`Error reading file ${file}: ${error.message}`);
      });

      writeStream.on('error', (error) => {
        console.error(
          `Error writing file ${file} to ${destination}: ${error.message}`,
        );
      });
    });
  });
};

copyDir(sourceFolder, destinationFolder);

console.log('Copying completed.');
