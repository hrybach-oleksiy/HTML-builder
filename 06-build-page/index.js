const fs = require('fs');
const path = require('path');

const sourceFolder = './06-build-page';
const destinationFolder = './06-build-page/project-dist';
const templateFileName = 'template.html';
const outputHtmlFileName = 'index.html';
const outputCssFileName = 'style.css';

const replaceTemplateTags = (templatePath, componentsPath) => {
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  const componentFiles = fs.readdirSync(componentsPath);

  let updatedContent = templateContent;

  componentFiles.forEach((componentFile) => {
    const componentName = path.parse(componentFile).name;
    const componentPath = path.join(componentsPath, componentFile);
    const componentContent = fs.readFileSync(componentPath, 'utf8');
    const templateTag = `{{${componentName}}}`;

    updatedContent = updatedContent.replace(
      new RegExp(templateTag, 'g'),
      componentContent,
    );
  });

  return updatedContent;
};

const compileStyles = (source, destination, outputFileName) => {
  const files = fs.readdirSync(source);
  const cssFiles = files.filter(
    (file) => path.extname(file).toLowerCase() === '.css',
  );
  const writeStream = fs.createWriteStream(
    path.join(destination, outputFileName),
  );

  cssFiles.forEach((file) => {
    const filePath = path.join(source, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    writeStream.write(`/* ${file} */\n${fileContent}\n\n`, (writeErr) => {
      if (writeErr) {
        console.error(`Error writing to output CSS file: ${writeErr.message}`);
      }
    });
  });

  writeStream.end(() => {
    console.log(
      `CSS compilation completed. Check ${outputFileName} in ${destination}.`,
    );
  });
};

const copyAssets = (source, destination) => {
  const assetsPath = path.join(destination, 'assets');

  if (!fs.existsSync(assetsPath)) {
    fs.mkdirSync(assetsPath, { recursive: true });
  }

  const files = fs.readdirSync(source);

  files.forEach((item) => {
    const sourcePath = path.join(source, item);
    const destinationPath = path.join(assetsPath, item);

    const isDirectory = fs.statSync(sourcePath).isDirectory();

    if (isDirectory) {
      copyAssets(sourcePath, destinationPath);
    } else {
      const readStream = fs.createReadStream(sourcePath);
      const writeStream = fs.createWriteStream(destinationPath);

      readStream.pipe(writeStream);

      readStream.on('error', (error) => {
        console.error(`Error reading asset file ${item}: ${error.message}`);
      });

      writeStream.on('error', (error) => {
        console.error(
          `Error writing asset file ${item} to ${assetsPath}: ${error.message}`,
        );
      });
    }
  });

  console.log('Asset copying completed.');
};

if (!fs.existsSync(destinationFolder)) {
  fs.mkdirSync(destinationFolder);
}

const updatedHtmlContent = replaceTemplateTags(
  path.join(sourceFolder, templateFileName),
  path.join(sourceFolder, 'components'),
);
fs.writeFileSync(
  path.join(destinationFolder, outputHtmlFileName),
  updatedHtmlContent,
);

compileStyles(
  path.join(sourceFolder, 'styles'),
  destinationFolder,
  outputCssFileName,
);

copyAssets(path.join(sourceFolder, 'assets'), destinationFolder);

console.log('Project building completed.');
