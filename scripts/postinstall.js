const fs = require('fs');
const path = require('path');

function copyDirectory(source, target) {
  // Create target directory if it doesn't exist
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  // Read source directory
  const files = fs.readdirSync(source);

  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);

    // Skip node_modules, .git directories, and package-lock.json
    if (file === 'node_modules' || file === '.git' || file === 'package-lock.json') {
      return;
    }

    // Check if it's a directory
    if (fs.lstatSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied: ${targetPath}`);
    }
  });
}

function removeDirectory(dir) {
  try {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.lstatSync(filePath).isDirectory()) {
          removeDirectory(filePath);
        } else {
          fs.unlinkSync(filePath);
        }
      }
      fs.rmdirSync(dir);
      console.log(`Removed directory: ${dir}`);
    }
  } catch (error) {
    console.error(`Error removing directory ${dir}:`, error);
  }
}

try {
  // Get source directory (where the template files are in node_modules)
  const sourceDir = path.join(__dirname, '..');
  
  // Get target directory (project root, two levels up from node_modules/package-name/scripts)
  const targetDir = path.join(__dirname, '..', '..', '..');

  // Don't copy if we're in development mode
  if (sourceDir === targetDir) {
    console.log('Skipping copy as we are in development mode');
    process.exit(0);
  }

  // Copy all files and directories
  copyDirectory(sourceDir, targetDir);
  console.log('Successfully copied template files to project root');

  // Delay the removal of package to avoid EBUSY error
  setTimeout(() => {
    const packageName = 'efc-yash-check';
    const nodeModulesPackagePath = path.join(targetDir, 'node_modules', packageName);
    removeDirectory(nodeModulesPackagePath);
    console.log(`Successfully removed ${packageName} from node_modules`);
  }, 3000); // Wait for 1 second before removing
} catch (error) {
  console.error('Error during postinstall:', error);
  process.exit(1);
} 