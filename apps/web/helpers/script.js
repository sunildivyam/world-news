const fs = require('fs');
const path = require('path');

function findAndTrimWorldNewsImports(srcDir = 'src') {
  const results = [];

  function walkDir(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        let trimmedLines = [];

        trimmedLines = lines.map((line, index) => {
          if (line.includes('@/types')) {
            line = line.replace('@/types', "@worldnews/shared")
            const trimmed = line.substring(0, line.indexOf('@worldnews/shared') + '@worldnews/shared'.length) + '";';
            results.push({
              file: filePath,
              line: index + 1,
              original: line,
              trimmed: trimmed
            });
            return trimmed;
          }
          return line;
        });

        // const trimmedContent = trimmedLines.join('\n');
        // fs.writeFileSync(filePath, trimmedContent, 'utf-8');
      }
    });
  }

  walkDir(srcDir);
  return results;
}

const results = findAndTrimWorldNewsImports();
console.log(results);
// module.exports = findAndTrimWorldNewsImports;
