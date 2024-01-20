const fs = require('fs');
const path = require('path');

const sourceFolder = './05-merge-styles/styles';
const destinationFolder = './05-merge-styles/project-dist';
const outputFile = 'bundle.css';

const compileStyles = (source, destination, outputFileName) => {
  // Read the contents of the source directory
  fs.readdir(source, (err, files) => {
    if (err) {
      console.error(`Error reading source directory: ${err.message}`);
      return;
    }

    const cssFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === '.css',
    );

    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination);
    }

    const writeStream = fs.createWriteStream(
      path.join(destination, outputFileName),
    );

    cssFiles.forEach((file) => {
      const filePath = path.join(source, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');

      writeStream.write(`/* ${file} */\n${fileContent}\n\n`, (writeErr) => {
        if (writeErr) {
          console.error(`Error writing to output file: ${writeErr.message}`);
        }
      });
    });

    writeStream.end(() => {
      console.log(
        `Compilation completed. Check ${outputFileName} in ${destination}.`,
      );
    });
  });
};

compileStyles(sourceFolder, destinationFolder, outputFile);
