const fs = require('fs').promises;
const fsPromises = require('fs').promises;
const path = require('path');

const sourceFolder = './06-build-page';
const destinationFolder = './06-build-page/project-dist';
const templateFileName = 'template.html';
const outputHtmlFileName = 'index.html';
const outputCssFileName = 'style.css';

const replaceTemplateTags = async (templatePath, componentsPath) => {
  try {
    const templateContent = await fs.readFile(templatePath, 'utf8');
    const componentFiles = await fs.readdir(componentsPath);

    let updatedContent = templateContent;

    for (const componentFile of componentFiles) {
      const componentName = path.parse(componentFile).name;
      const componentPath = path.join(componentsPath, componentFile);
      const componentContent = await fs.readFile(componentPath, 'utf8');
      const templateTag = `{{${componentName}}}`;

      updatedContent = updatedContent.replace(
        new RegExp(templateTag, 'g'),
        componentContent,
      );
    }

    return updatedContent;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

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
      `CSS compilation completed. Check ${outputFileName} in ${destination}.`,
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const copyAssets = async (source, destination) => {
  try {
    const assetsPath = path.join(destination, 'assets');

    await fsPromises.mkdir(assetsPath, { recursive: true });

    const files = await fsPromises.readdir(source);

    for (const item of files) {
      const sourcePath = path.join(source, item);
      const destinationPath = path.join(assetsPath, item);

      const isDirectory = (await fsPromises.stat(sourcePath)).isDirectory();

      if (isDirectory) {
        await copyAssets(sourcePath, destinationPath);
      } else {
        const fileContent = await fsPromises.readFile(sourcePath);

        await fsPromises.writeFile(destinationPath, fileContent);
      }
    }

    console.log('Asset copying completed.');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const buildProject = async () => {
  try {
    await fs.mkdir(destinationFolder, { recursive: true });

    const updatedHtmlContent = await replaceTemplateTags(
      path.join(sourceFolder, templateFileName),
      path.join(sourceFolder, 'components'),
    );

    await fs.writeFile(
      path.join(destinationFolder, outputHtmlFileName),
      updatedHtmlContent,
    );

    await compileStyles(
      path.join(sourceFolder, 'styles'),
      destinationFolder,
      outputCssFileName,
    );

    await copyAssets(path.join(sourceFolder, 'assets'), destinationFolder);

    console.log('Project building completed.');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

buildProject();
