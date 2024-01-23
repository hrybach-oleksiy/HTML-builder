const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const destinationDir = path.join(__dirname, 'files-copy');

const copyDir = (source, destination) => {
  fs.mkdir(destination, { recursive: true }, (err) => {
    if (err) {
      console.error(`Error creating destination directory: ${err.message}`);
      return;
    }

    fs.readdir(source, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error(`Error reading source directory: ${err.message}`);
        return;
      }

      files.forEach((file) => {
        const sourcePath = path.join(source, file.name);
        const destinationPath = path.join(destination, file.name);

        if (file.isDirectory()) {
          copyDir(sourcePath, destinationPath);
        } else {
          fs.copyFile(sourcePath, destinationPath, (err) => {
            if (err) {
              console.error(`Error copying file: ${err.message}`);
            }
          });
        }
      });
    });
  });
};

copyDir(sourceDir, destinationDir);
