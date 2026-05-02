import fs from 'fs';

const filePath = 'd:/D refresh/nextjs/Agro new/AgroManage_nextjs/server/drizzle/schema.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Fix the nested quotes pattern: "schema."sequence_name"" -> "schema.sequence_name"
const fixedContent = content.replace(/generatedAlwaysAsIdentity\({ name: "([^"]+)\."([^"]+)"",/g, 'generatedAlwaysAsIdentity({ name: "$1.$2",');

if (content !== fixedContent) {
    fs.writeFileSync(filePath, fixedContent);
    console.log("Fixed syntax errors in drizzle/schema.ts");
} else {
    console.log("No syntax errors found in drizzle/schema.ts matching the pattern.");
}
