const fs = require('fs');
const path = require('path');

function buildExports(sourceFolder) {
  try {
    // Read all files in the source folder
    const files = fs.readdirSync(sourceFolder);

    // Filter only .ts files (excluding index.ts)
    const tsFiles = files.filter(file =>
      file.endsWith('.ts') && file !== 'index.ts'
    );

    // Create export statements
    const exports = tsFiles
      .map(file => `export * from "./${file.split('.ts')[0]}";`)
      .join('\n');

    // Write to index.ts
    const indexPath = path.join(sourceFolder, 'index.ts');
    fs.writeFileSync(indexPath, exports + '\n');
    console.log(indexPath, exports);


    console.log(`Created index.ts with ${tsFiles.length} exports`);
  } catch (error) {
    console.error('Error building exports:', error.message);
  }
}

// Usage
buildExports('./packages/shared/types');

// node ./helpers/build-exports.js
