
import path, { dirname } from 'path'
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nonceValue = generateNonce(); // Implement your nonce generation logic

const buildDirectory = path.resolve(__dirname, '../dist'); // Adjust the path to your build directory


const createDirectory = (directoryPath) => {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
        console.log(`Directory created: ${directoryPath}`);
    } else {
        fs.rmdirSync(destinationDirectory, { recursive: true });
        fs.mkdirSync(destinationDirectory);
        console.log(`Deleted and created: ${directoryPath}`);
    }
  };

  const copyFile = (sourcePath, destinationPath) => {
    fs.copyFileSync(sourcePath, destinationPath);
    console.log(`File copied from ${sourcePath} to ${destinationPath}`);
  };

 // Function to replace all occurrences of text in a file
const replaceTextInFile = (filePath, searchText, replacementText) => {
    let fileContent = fs.readFileSync(filePath, 'utf-8');
    const regex = new RegExp(searchText, 'g');
    const replacedContent = fileContent.replace(regex, replacementText);

    if (fileContent !== replacedContent) {
      fs.writeFileSync(filePath, replacedContent);
      console.log(`Text ${searchText} replaced by ${replacementText} in ${filePath}`);
      return true; // Replacements were made
    } else {
      return false; // No replacements made
    }
  };

const adjustNginxFiles = async () => {
    const CICDDirectory = path.resolve(__dirname, '../_CICD/nginx');
    const destinationDirectory = path.resolve(__dirname, '../dist/_nginx');

    createDirectory(destinationDirectory);

    copyFile(path.resolve(CICDDirectory,'./nginx_local.conf'), path.resolve(destinationDirectory, 'nginx_local.conf'));
    copyFile(path.resolve(CICDDirectory,'./nginx_dev.conf'), path.resolve(destinationDirectory, 'nginx_dev.conf'));
    copyFile(path.resolve(CICDDirectory,'./nginx_qa.conf'), path.resolve(destinationDirectory, 'nginx_qa.conf'));
    copyFile(path.resolve(CICDDirectory,'./nginx_stg.conf'), path.resolve(destinationDirectory, 'nginx_stg.conf'));
    copyFile(path.resolve(CICDDirectory,'./nginx_prod.conf'), path.resolve(destinationDirectory, 'nginx_prod.conf'));


    replaceTextInFile(path.resolve(destinationDirectory,'nginx_local.conf'), 'nonce-random_value', `nonce-${nonceValue}`);
    replaceTextInFile(path.resolve(destinationDirectory,'nginx_dev.conf'), 'nonce-random_value', `nonce-${nonceValue}`);
    replaceTextInFile(path.resolve(destinationDirectory,'nginx_qa.conf'), 'nonce-random_value', `nonce-${nonceValue}`);
    replaceTextInFile(path.resolve(destinationDirectory,'nginx_stg.conf'), 'nonce-random_value', `nonce-${nonceValue}`);
    replaceTextInFile(path.resolve(destinationDirectory,'nginx_prod.conf'), 'nonce-random_value', `nonce-${nonceValue}`);
}

const scriptNonceHandler = async () => {
  const indexPath = path.join(buildDirectory, 'index.html');

  try {
    let indexFile = fs.readFileSync(indexPath, 'utf-8');

    // Modify script tags with the nonce value
    indexFile = indexFile.replace(/<script(.*?)>/g, (match, p1) => {
      if (!p1.includes('nonce')) {
        return `<script nonce="${nonceValue}"${p1}>`;
      }
      return match;
    });

    fs.writeFileSync(indexPath, indexFile, 'utf-8');

    console.log(`Script tags modified with nonce value: ${nonceValue} on file ${indexPath}`);
  } catch (error) {
    console.error('Error modifying scripts:', error);
  }
}

const linkNonceHandler = async () => {
    const indexPath = path.join(buildDirectory, 'index.html');

    try {
      let indexFile = fs.readFileSync(indexPath, 'utf-8');

      // Modify script tags with the nonce value
      indexFile = indexFile.replace(/<link(.*?)>/g, (match, p1) => {
        if (!p1.includes('nonce')) {
          return `<link nonce="${nonceValue}"${p1}>`;
        }
        return match;
      });

      fs.writeFileSync(indexPath, indexFile, 'utf-8');

      console.log(`Link tags modified with nonce value: ${nonceValue} on file ${indexPath}`);
    } catch (error) {
      console.error('Error modifying link:', error);
    }
  }

function generateNonce() {
   return crypto.randomBytes(16).toString('base64');
}

const nonceHandler = async () => {
    adjustNginxFiles();
    scriptNonceHandler();
    linkNonceHandler();

    console.log('Nonce handler executed successfully');
}

nonceHandler();
