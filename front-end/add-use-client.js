import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const dirsToProcess = ['components', 'hooks', 'app'].map(d => path.join(process.cwd(), d));

dirsToProcess.forEach(dir => {
  walkDir(dir, function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      // Don't add use client to layout.tsx at the root of app if we want to keep it a server component
      // But if it has metadata, it MUST be a server component.
      
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Skip root layout and next config or generic d.ts
      if (filePath.replace(/\\/g, '/').endsWith('app/layout.tsx')) return;
      if (filePath.endsWith('.d.ts')) return;
      if (filePath.replace(/\\/g, '/').endsWith('app/not-found.tsx')) return; // usually simple

      if (!content.includes('"use client"') && !content.includes("'use client'")) {
        // Just add "use client" to the top of the file
        // To be safe, put it before any imports
        fs.writeFileSync(filePath, '"use client";\n\n' + content, 'utf8');
        console.log(`Added "use client" to ${filePath}`);
      }
    }
  });
});

console.log('Finished adding use client directive.');
