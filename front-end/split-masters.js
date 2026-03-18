import fs from 'fs';
import path from 'path';

const masterContent = fs.readFileSync(path.join(process.cwd(), 'app/masters/page.tsx'), 'utf8');

// Find all exports: 'export function ComponentNamePage() {'
const exportRegex = /export\s+function\s+([A-Za-z0-9_]+)Page\(\)\s*{([\s\S]*?)(?=^export\s+function|\n$)/gm;

let match;

const toKebabCase = (str) => {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};

while ((match = exportRegex.exec(masterContent)) !== null) {
  let name = match[1];
  let body = match[2];
  let folderName = toKebabCase(name);
  
  if (folderName === 'uom') folderName = 'uom'; // small adjustment if needed, toKebabCase might leave uom as uom
  
  let content = `import MasterCrudPage from "@/components/MasterCrudPage";\n\nexport default function ${name}Page() {${body}\n`;
  
  let destDir = path.join(process.cwd(), `app/${folderName}`);
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(path.join(destDir, 'page.tsx'), content, 'utf8');
  console.log(`Created app/${folderName}/page.tsx`);
}

// Optionally, delete app/masters if it was just a dump.
// fs.rmSync(path.join(process.cwd(), 'app/masters'), { recursive: true, force: true });
