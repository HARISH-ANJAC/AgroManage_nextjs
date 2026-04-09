const fs = require('fs');

const files = [
  "D:/D refresh/nextjs/Agro new/AgroManage_nextjs/front-end/app/customer-receipts/create/page.tsx",
  "D:/D refresh/nextjs/Agro new/AgroManage_nextjs/front-end/app/delivery-notes/create/page.tsx",
  "D:/D refresh/nextjs/Agro new/AgroManage_nextjs/front-end/app/expenses/create/page.tsx",
  "D:/D refresh/nextjs/Agro new/AgroManage_nextjs/front-end/app/goods-receipts/create/page.tsx",
  "D:/D refresh/nextjs/Agro new/AgroManage_nextjs/front-end/app/purchase-booking/create/page.tsx",
  "D:/D refresh/nextjs/Agro new/AgroManage_nextjs/front-end/app/quotations-rfq/create/page.tsx",
  "D:/D refresh/nextjs/Agro new/AgroManage_nextjs/front-end/app/sales-invoices/create/page.tsx"
];

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log("File not found: " + file);
    continue;
  }
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes("const [isSaving, setIsSaving]")) {
    console.log("Already has isSaving: " + file);
    continue;
  }

  // Inject state
  content = content.replace(/(const \[items, setItems\] = useState[^;]*;|const \[files, setFiles\] = useState[^;]*;)/, 
    '$1\n  const [isSaving, setIsSaving] = useState(false);');

  if (!content.includes('const [isSaving, setIsSaving]')) {
    content = content.replace(/(const searchParams = useSearchParams\(\);)/, '$1\n  const [isSaving, setIsSaving] = useState(false);');
  }

  // Inject setIsSaving(true) into handleSubmit/handleSave right before try {
  content = content.replace(/(\s*)try\s*\{/g, (match, prefix) => {
     return prefix + 'setIsSaving(true);' + match;
  });

  // Wrap catch with finally:
  // match "} catch (e) { ... toast.error ... }" followed by "};"
  content = content.replace(/(\}\s*catch\s*(?:\([^)]*\))?\s*\{[\s\S]*?toast\.error[^}]*?\n\s*\})(\n\s*};?)/g, '$1 finally {\n      setIsSaving(false);\n    }$2');
  
  // Just in case catch doesn't have toast.error:
  // try to find generic catch block ending with `};` for handle functions.
  content = content.replace(/(\}\s*catch\s*(?:\([^)]*\))?\s*\{[\s\S]*?\n\s*\})(\n\s*};?)/g, (match, p1, p2) => {
      if (p1.includes('finally {')) return match;
      return p1 + ' finally {\n      setIsSaving(false);\n    }' + p2;
  });

  // Add disabled={isSaving} to buttons calling handle
  content = content.replace(/(<Button[^>]*?onClick=\{\([^)]*\)\s*=>\s*handle(?:Submit|Save|Approve)[^}]*\}[^>]*?)>/g, (m, p1) => {
    if (m.includes('disabled=')) return m; 
    return p1 + ' disabled={isSaving}>';
  });
  
  // also handle onClick={handleConfirm} or similar:
  content = content.replace(/(<Button[^>]*?onClick=\{handle(?:Submit|Save|Approve|Confirm)\}[^>]*?)>/g, (m, p1) => {
    if (m.includes('disabled=')) return m; 
    return p1 + ' disabled={isSaving}>';
  });

  fs.writeFileSync(file, content);
  console.log("Processed " + file);
}
