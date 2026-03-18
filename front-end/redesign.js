import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "components", "sidebar.tsx");
let content = fs.readFileSync(filePath, "utf8");

// 1. Change logo background to match the orange brand color (e.g. amber-500)
// Original: className="bg-secondary p-2.5 rounded-2xl shadow-lg shadow-secondary/20 shrink-0 group-hover:rotate-6 transition-transform"
content = content.replace(
  /className="bg-secondary p-2\.5 rounded-2xl shadow-lg shadow-secondary\/20 shrink-0 group-hover:rotate-6 transition-transform"/g,
  `className="bg-amber-500/90 p-2.5 rounded-2xl shadow-lg shadow-amber-500/30 shrink-0 group-hover:rotate-6 transition-transform"`
);

// 2. Change active and inactive link classes
// Original classes: 
// text-white bg-secondary shadow-lg shadow-secondary/20
// text-white/50 hover:text-white hover:bg-white/5
content = content.replace(
  /'text-white bg-secondary shadow-lg shadow-secondary\/20'/g,
  `'text-white font-bold bg-amber-500 shadow-lg shadow-amber-500/40'` // Active class
);
content = content.replace(
  /'text-white\/50 hover:text-white hover:bg-white\/5'/g,
  `'text-white/60 hover:text-white hover:bg-white/10'` // Inactive class
);

// Remove the left white strip entirely (it's not in the screenshot)
content = content.replace(
  /\{\s*isActive\s*&&\s*\(\s*<div\s*className="absolute\s*left-0\s*top-2\.5\s*bottom-2\.5\s*w-1\s*bg-white\/40\s*rounded-full"\s*\/>\s*\)\s*\}/g,
  ``
);

// Fix icon active coloring to match text, removing text-secondary
content = content.replace(
  /text-secondary\/60 group-hover:text-secondary group-hover:scale-110/g,
  `text-white/50 group-hover:text-amber-500 group-hover:scale-110` // Make inactive icon nice white/50, hover turns brand orange
);

// Let's modify the profile card footer to look like the exact neat glassmorphism card (like #1D2A18)
// Original: className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-500 ${isCollapsed && !isMobile ? 'justify-center px-0' : 'bg-white/5 border border-white/5'} hover:bg-white/10 group`}
content = content.replace(
  /className=\{\`w-full flex items-center gap-4 p-3\.5 rounded-2xl transition-all duration-500 \$\{\s*isCollapsed && !isMobile \? 'justify-center px-0' : 'bg-white\/5 border border-white\/5'\s*\} hover:bg-white\/10 group\`\}/g,
  `className={\`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-500 \${isCollapsed && !isMobile ? 'justify-center px-0' : 'bg-white/10 backdrop-blur-sm border border-white/10 shadow-lg'} hover:bg-white/20 group\`}`
);

fs.writeFileSync(filePath, content, "utf8");
console.log("Sidebar redesign classes updated!");
