const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

const compileCSSBundle = () => {
  fs.mkdir(outputDir, { recursive: true }, (err) => {
    if (err) {
      console.error(`Error creating output directory: ${err.message}`);
      return;
    }

    fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error(`Error reading styles directory: ${err.message}`);
        return;
      }

      const cssFiles = files.filter(
        (file) => file.isFile() && path.extname(file.name) === '.css',
      );

      let cssBundle = '';

      cssFiles.forEach((file, index, array) => {
        const filePath = path.join(stylesDir, file.name);

        fs.readFile(filePath, 'utf8', (err, fileContent) => {
          if (err) {
            console.error(`Error reading file: ${err.message}`);
          } else {
            cssBundle += `${fileContent}\n`;

            if (index === array.length - 1) {
              fs.writeFile(outputFile, cssBundle, (err) => {
                if (err) {
                  console.error(`Error writing CSS bundle: ${err.message}`);
                } else {
                  console.log('CSS bundle created successfully.');
                }
              });
            }
          }
        });
      });
    });
  });
};

compileCSSBundle();
