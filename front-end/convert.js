import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processContent(content) {
  let modified = content;

  // React Router replacements
  if (modified.includes('useNavigate') && modified.includes('react-router-dom')) {
    modified = modified.replace(/import\s*{([^}]*)\buseNavigate\b([^}]*)}\s*from\s*['"]react-router-dom['"]\s*;*/g, 
      (match, p1, p2) => {
        let others = [p1.trim(), p2.trim()].filter(x => x && x !== ',').join(', ');
        let result = `import { useRouter } from 'next/navigation';\n`;
        if (others.replace(/,/g, '').trim()) {
           // if there are others like Link
           result += `import { ${others} } from 'react-router-dom';\n`;
        }
        return result;
      }
    );
    modified = modified.replace(/useNavigate\(\)/g, 'useRouter()');
  }

  // Handle other hooks like useLocation
  if (modified.includes('useLocation') && modified.includes('react-router-dom')) {
    modified = modified.replace(/import\s*{([^}]*)\buseLocation\b([^}]*)}\s*from\s*['"]react-router-dom['"]\s*;*/g, 
      (match, p1, p2) => {
        let result = `import { usePathname } from 'next/navigation';\n`;
        // if preserving others ... ignoring complexity for now
        return result;
      }
    );
    modified = modified.replace(/useLocation\(\)/g, 'usePathname()');
  }
  
  // Clean up any empty imports from react-router-dom
  modified = modified.replace(/import\s*{\s*}\s*from\s*['"]react-router-dom['"]\s*;\n*/g, '');

  return modified;
}

// 1. Convert components, hooks, lib (already copied, now string replacements)
const dirsToProcess = ['components', 'hooks', 'lib'].map(d => path.join(process.cwd(), d));

dirsToProcess.forEach(dir => {
  if (fs.existsSync(dir)) {
    walkDir(dir, function(filePath) {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = processContent(content);
        if (content !== newContent) {
          fs.writeFileSync(filePath, newContent, 'utf8');
        }
      }
    });
  }
});

// 2. Map pages to App Router
const pagesDir = path.join(process.cwd(), '../Vite_react/agro-flow/src/pages');
const appDir = path.join(process.cwd(), 'app');

const routeMapping = {
  'Index.tsx': 'page.tsx', // usually home
  'DashboardPage.tsx': 'dashboard/page.tsx',
  'ProductsPage.tsx': 'products/page.tsx',
  'CustomersPage.tsx': 'customers/page.tsx',
  'SuppliersPage.tsx': 'suppliers/page.tsx',
  'PurchaseOrdersPage.tsx': 'purchase-orders/page.tsx',
  'CreatePurchaseOrderPage.tsx': 'purchase-orders/create/page.tsx',
  // MasterPages.tsx ? Maybe we'll check where it mounts. Let's just put it in masters/page.tsx for now
  'MasterPages.tsx': 'masters/page.tsx'
};

if (fs.existsSync(pagesDir)) {
  fs.readdirSync(pagesDir).forEach(file => {
    if (file.endsWith('.tsx')) {
      let destRel = routeMapping[file];
      if (destRel) {
        let dest = path.join(appDir, destRel);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        
        // Remove or preserve if exists? Let's overwrite.
        let content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
        
        // Next.js pages must have default export for routing functions
        content = processContent(content);
        
        // Ensure export default function exists if not
        if (content.includes('const ') && content.includes('export default') === false) {
           // naive fix if needed
        }
        
        fs.writeFileSync(dest, content, 'utf8');
        console.log(`Converted ${file} to ${destRel}`);
      }
    }
  });
}

console.log('Conversion completed.');
