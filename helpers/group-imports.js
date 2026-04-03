const fs = require('fs');

const path = require('path');

function groupImports(srcFolder) {
  const files = getAllFiles(srcFolder);

  for (const file of files) {
    if (!/\.(ts|tsx)$/.test(file)) continue;

    let content = fs.readFileSync(file, 'utf-8');
    const importMap = new Map();

    // Parse imports
    const importRegex = /import\s+{\s*([^}]+)\s*}\s+from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const imports = match[1].split(',').map(s => s.trim());
      const source = match[2];

      if (!importMap.has(source)) {
        importMap.set(source, []);
      }
      importMap.get(source).push(...imports);
    }

    // Remove duplicate imports and rebuild
    let newContent = content.replace(importRegex, '');

    const newImports = Array.from(importMap.entries())
      .map(([source, imports]) => {
        const unique = [...new Set(imports)].join(', ');
        return `import { ${unique} } from '${source}';`;
      })
      .join('\n');

    // Remove leading empty lines and insert imports
    newContent = newContent.replace(/^\s*\n/, newImports + '\n\n');
    fs.writeFileSync(file, newContent);
    // console.log(importMap, '||\n', newImports);
  }
}

function getAllFiles(dir) {
  const files = fs.readdirSync(dir);
  let results = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      results = results.concat(getAllFiles(filePath));
    } else {
      results.push(filePath);
    }
  }
  return results;
}

groupImports(path.join(__dirname, '../src'));

/**
write a node function that reads all .ts and .tsx files from src folder and groups all duplicated imports in to one import.
Take the below example:
if actual is:

import { AppError } from "@worldnews/shared";
import { usePathname } from "next/navigation";
import { useFace, useAbc } from "next/navigation";
import { PageTypeEnum } from "@worldnews/shared";

replace them with:
import { AppError, PageTypeEnum } from "@worldnews/shared";
import { usePathname, useFace, useAbc } from "next/navigation";
const fs = require('fs');
const path = require('path');

*/
