import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "components", "MasterCrudPage.tsx");
let content = fs.readFileSync(filePath, "utf8");

content = content.replace(
  /<div className="flex items-center justify-between mb-6">/g,
  `<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">`
);

content = content.replace(
  /<div className="flex items-center gap-2">/g,
  `<div className="flex flex-wrap items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">`
);

content = content.replace(
  /<div className="bg-card rounded-xl border p-6">/g,
  `<div className="bg-card rounded-xl border p-4 sm:p-6 shadow-sm overflow-hidden w-full">`
);

content = content.replace(
  /<div className="flex items-center justify-between mb-4">/g,
  `<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">`
);

content = content.replace(
  /<div className="relative max-w-md flex-1">/g,
  `<div className="relative w-full sm:max-w-md flex-1">`
);

content = content.replace(
  /<Input placeholder={`\$\{?Search\}\s*\$\{title\.toLowerCase\(\)\}\.\.\.`} value=\{search\} onChange=\{\(e\) => \{ setSearch\(e\.target\.value\); setCurrentPage\(1\); \}\} className="pl-9" \/>/g,
  `<Input placeholder={\`Search \${title.toLowerCase()}...\`} value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="pl-9 w-full" />`
);

content = content.replace(
  /<div className="flex items-center gap-2 ml-4">/g,
  `<div className="flex items-center gap-2 self-end sm:self-auto shrink-0 w-full sm:w-auto justify-end">`
);

content = content.replace(
  /<div className="overflow-x-auto">/g,
  `<div className="overflow-x-auto w-full max-w-[calc(100vw-2rem)] sm:max-w-none">`
);

fs.writeFileSync(filePath, content, "utf8");
console.log("MasterCrudPage updated successfully.");
