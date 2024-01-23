const fs = require('fs').promises;
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
    const files = await fs.readdir(source);
    const cssFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === '.css',
    );

    const outputFile = path.join(destination, outputFileName);

    let cssContent = '';

    for (const file of cssFiles) {
      const filePath = path.join(source, file);
      const fileContent = await fs.readFile(filePath, 'utf8');

      cssContent += `/* ${file} */\n${fileContent}\n\n`;
    }

    await fs.writeFile(outputFile, cssContent);

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
    const entries = await fs.readdir(source, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const destinationPath = path.join(destination, entry.name);

      if (entry.isDirectory()) {
        await fs.mkdir(destinationPath, { recursive: true });
        await copyAssets(sourcePath, destinationPath);
      } else {
        await fs.copyFile(sourcePath, destinationPath);
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

    await copyAssets(
      path.join(sourceFolder, 'assets'),
      path.join(destinationFolder, 'assets'),
    );

    console.log('Project building completed.');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

buildProject();
