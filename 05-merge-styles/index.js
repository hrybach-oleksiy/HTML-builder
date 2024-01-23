const fsPromises = require('fs').promises;
const path = require('path');

const sourceFolder = './05-merge-styles';
const destinationFolder = './05-merge-styles/project-dist';
const outputCssFileName = 'bundle.css';

const compileStyles = async (source, destination, outputFileName) => {
  try {
    const files = await fsPromises.readdir(source);
    const cssFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === '.css',
    );

    const outputFile = path.join(destination, outputFileName);

    let cssContent = '';

    for (const file of cssFiles) {
      const filePath = path.join(source, file);
      const fileContent = await fsPromises.readFile(filePath, 'utf8');

      cssContent += `/* ${file} */\n${fileContent}\n\n`;
    }

    await fsPromises.writeFile(outputFile, cssContent);

    console.log(
      `CSS bundle compilation completed. Check ${outputFileName} in ${destination}.`,
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const buildCssBundle = async () => {
  try {
    await fsPromises.mkdir(destinationFolder, { recursive: true });

    await compileStyles(
      path.join(sourceFolder, 'styles'),
      destinationFolder,
      outputCssFileName,
    );

    console.log('CSS bundle building completed.');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

buildCssBundle();
