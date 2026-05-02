import fs from 'fs';

const filePath = 'd:/D refresh/nextjs/Agro new/AgroManage_nextjs/server/drizzle/schema.ts';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix the nested quotes pattern: "schema."sequence_name"" -> "schema.sequence_name"
content = content.replace(/generatedAlwaysAsIdentity\({ name: "([^"]+)\."([^"]+)"",/g, 'generatedAlwaysAsIdentity({ name: "$1.$2",');

// 2. Fix unknown("...") calls for bytea columns
// First, add customType to imports if it's not there
if (content.includes('unknown(') && !content.includes('customType')) {
    content = content.replace(/import { ([^}]+) } from "drizzle-orm\/pg-core"/, 'import { $1, customType } from "drizzle-orm/pg-core"');
}

// Add bytea definition if needed
if (content.includes('unknown(')) {
    const byteaDef = `\nconst bytea = customType<{ data: Buffer }>({ dataType() { return 'bytea'; } });\n`;
    if (!content.includes('const bytea =')) {
        // Insert after imports
        content = content.replace(/(import .* from "drizzle-orm";?\n)/, '$1' + byteaDef);
        // If not found, insert at top
        if (!content.includes('const bytea =')) {
            content = content.replace(/(import .* from "drizzle-orm\/pg-core";?\n)/, '$1' + byteaDef);
        }
    }
    
    // Replace unknown("...") with bytea("...")
    content = content.replace(/unknown\("([^"]+)"\)/g, 'bytea("$1")');
}

fs.writeFileSync(filePath, content);
console.log("Fixed syntax and unknown type errors in drizzle/schema.ts");
