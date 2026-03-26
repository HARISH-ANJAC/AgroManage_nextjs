import fs from 'fs';
import path from 'path';

const sql = fs.readFileSync('Prime Table structure new 17th Mar (1).sql', 'utf8');

let tSql = sql.replace(/\/\*[\s\S]*?\*\//g, '');
const blocks = tSql.split(/CREATE\s+TABLE\s+/i);

const schemas = {}; 

for (let i = 1; i < blocks.length; i++) {
   const block = blocks[i];
   const headerMatch = block.match(/^\s*\[?([a-zA-Z0-9_]+)\]?\.\[?([a-zA-Z0-9_]+)\]?\s*\(/i);
   if (!headerMatch) {
       continue;
   }

   let schemaName = headerMatch[1].toLowerCase();
   if (schemaName.toLowerCase() === 'stomaster') schemaName = 'StoMaster';
   if (schemaName.toLowerCase() === 'stoentries') schemaName = 'StoEntries';

   const tableName = headerMatch[2];
   const uppercaseTableName = tableName.toUpperCase();

   const startIdx = headerMatch[0].length - 1;
   let brace = 0;
   let endIdx = -1;
   for (let j = startIdx; j < block.length; j++) {
       if (block[j] === '(') brace++;
       else if (block[j] === ')') brace--;
       if (brace === 0) {
           endIdx = j;
           break;
       }
   }

   if (endIdx === -1) continue;

   let parseBody = block.substring(startIdx + 1, endIdx);
   parseBody = parseBody.replace(/--.*/g, ''); 

   const cols = [];
   let currentLine = '';
   let innerBrace = 0;
   for (let j = 0; j < parseBody.length; j++) {
       const char = parseBody[j];
       if (char === '(') innerBrace++;
       if (char === ')') innerBrace--;
       if (char === ',' && innerBrace === 0) {
           cols.push(currentLine.trim());
           currentLine = '';
       } else {
           currentLine += char;
       }
   }
   if (currentLine.trim()) cols.push(currentLine.trim());

   if (!schemas[schemaName]) schemas[schemaName] = {};
   schemas[schemaName][uppercaseTableName] = { realTableName: tableName, cols: [], relations: [] };

   for (let def of cols) {
       def = def.trim();
       if (!def) continue;

       const colMatch = def.match(/^\[?([a-zA-Z0-9_]+)\]?\s+\[?([a-zA-Z0-9_]+)\]?(?:\(\s*(max|\d+)(?:\s*,\s*(\d+))?\s*\))?(.*)/i);
       if (!colMatch) continue;

       const cName = colMatch[1];
       const cType = colMatch[2].toLowerCase();
       const lenOrPrec = colMatch[3];
       const scale = colMatch[4];
       const rest = colMatch[5] || '';

       let isPk = /primary\s+key/i.test(rest);
       let isUnique = /unique/i.test(rest);
       let isIdentity = /identity/i.test(rest) || /serial/i.test(cType);
       let isNotNull = /not\s+null/i.test(rest) || isPk;
       
       let fkTable = null;
       let fkCol = null;
       let fkSchema = null;
       const fkMatch = rest.match(/references\s+\[?([a-zA-Z0-9_]+)\]?(?:\.\[?([a-zA-Z0-9_]+)\]?)?\s*\(\s*\[?([a-zA-Z0-9_]+)\]?\s*\)/i);
       if (fkMatch) {
            if (fkMatch[2]) {
                fkSchema = fkMatch[1].toLowerCase();
                fkTable = fkMatch[2].toUpperCase();
            } else {
                fkSchema = schemaName;
                fkTable = fkMatch[1].toUpperCase();
            }
            if (fkSchema === 'stomaster') fkSchema = 'StoMaster';
            if (fkSchema === 'stoentries') fkSchema = 'StoEntries';
            fkCol = fkMatch[3];
       }

       schemas[schemaName][uppercaseTableName].cols.push({
           name: cName,
           type: cType,
           lenOrPrec,
           scale,
           isPk,
           isUnique,
           isIdentity,
           isNotNull,
           fkSchema,
           fkTable,
           fkCol
       });
   }
}

// Pass 2: fix casing of foreign key columns
for (const [sName, sMeta] of Object.entries(schemas)) {
    for (const [tName, tMeta] of Object.entries(sMeta)) {
        for (const col of tMeta.cols) {
            if (col.fkTable) {
                const refTableObj = schemas[col.fkSchema] ? schemas[col.fkSchema][col.fkTable] : null;
                if (refTableObj) {
                    const refColObj = refTableObj.cols.find(c => c.name.toLowerCase() === col.fkCol.toLowerCase());
                    if (refColObj) {
                        col.fkCol = refColObj.name;
                    }
                }
            }
        }
    }
}


function getDrizzleType(c, tableName, schemaName) {
   let fn = '';
   let type = c.type;
   if (type === 'int' || type === 'integer' || type === 'smallint' || type === 'tinyint') {
       fn = c.isIdentity ? `serial("${c.name}")` : `integer("${c.name}")`;
   } else if (type === 'bigint') {
       fn = c.isIdentity ? `bigserial("${c.name}", { mode: "number" })` : `bigint("${c.name}", { mode: "number" })`;
   } else if (type === 'varchar' || type === 'nvarchar' || type === 'char' || type === 'nchar') {
       if (c.lenOrPrec && c.lenOrPrec.toLowerCase() !== 'max') fn = `varchar("${c.name}", { length: ${c.lenOrPrec} })`;
       else fn = `text("${c.name}")`; 
   } else if (type === 'decimal' || type === 'numeric') {
       if (c.lenOrPrec && c.scale) fn = `numeric("${c.name}", { precision: ${c.lenOrPrec}, scale: ${c.scale} })`;
       else if (c.lenOrPrec) fn = `numeric("${c.name}", { precision: ${c.lenOrPrec} })`;
       else fn = `numeric("${c.name}")`;
   } else if (type === 'datetime' || type === 'date' || type === 'datetime2') {
       fn = `timestamp("${c.name}", { mode: "date" })`;
   } else if (type === 'varbinary' || type === 'image') {
       fn = `bytea("${c.name}")`;
   } else {
       fn = `text("${c.name}")`;
   }

   if (c.isPk) fn += '.primaryKey()';
   if (c.isUnique) fn += '.unique()';
   if (c.isNotNull && !c.isPk && !c.isIdentity) fn += '.notNull()';

   return fn;
}

const outDir = 'src/db/schema';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const indexExports = [];

for (const [sName, sMeta] of Object.entries(schemas)) {
   let content = `export const ${sName}Schema = pgSchema("${sName.toLowerCase()}");\n\n`;
   let relationsContent = [];
   const imports = new Set([
      `import { relations } from "drizzle-orm";`,
      `import { pgSchema, integer, serial, bigint, bigserial, varchar, text, numeric, timestamp, customType } from "drizzle-orm/pg-core";`
   ]);

  let customTypes = `export const bytea = customType<{ data: Buffer, notNull: false, default: false }>({
  dataType() { return 'bytea'; },
});\n\n`;

   for (const [tName, tMeta] of Object.entries(sMeta)) {
       content += `export const ${tName} = ${sName}Schema.table("${tMeta.realTableName}", {\n`;
       
       let fks = [];

       for (const c of tMeta.cols) {
           let dType = getDrizzleType(c, tName, sName);

           if (c.fkTable) {
               const refS = c.fkSchema;
               const refT = c.fkTable;
               const refC = c.fkCol;

               const refRealTableNameObj = schemas[refS] && schemas[refS][refT] ? schemas[refS][refT] : null;

               if (refS !== sName) {
                   imports.add(`import * as ${refS}Schema from "./${refS}.js";`);
                   dType += `.references(() => ${refS}Schema.${refT}.${refC})`;
               } else {
                   dType += `.references(() => ${refT}.${refC})`;
               }
               
               let relName = refT.replace(/^TBL_/i, '').toLowerCase();
               if (!relName) relName = 'ref';
               fks.push({
                   col: c.name,
                   refS,
                   refT,
                   refC,
                   relName
               });
           }

           content += `  ${c.name}: ${dType},\n`;
       }
       content += `});\n\n`;

       if (fks.length > 0) {
           relationsContent.push(`export const ${tName}Relations = relations(${tName}, ({ one }) => ({`);
           let usedRels = new Set();
           for (const fk of fks) {
               let rName = fk.relName;
               if (usedRels.has(rName)) {
                   rName = rName + '_' + fk.col.toLowerCase();
               }
               usedRels.add(rName);
               const refPrefix = fk.refS !== sName ? `${fk.refS}Schema.` : '';
               relationsContent.push(`  ${rName}: one(${refPrefix}${fk.refT}, { fields: [${tName}.${fk.col}], references: [${refPrefix}${fk.refT}.${fk.refC}] }),`);
           }
           relationsContent.push(`}));\n\n`);
       }
   }

   const finalStr = [
      Array.from(imports).join('\n'),
      sName === "StoMaster" ? customTypes : `import { bytea } from "./StoMaster.js";`,
      content,
      relationsContent.join('\n')
   ].join('\n\n');

   fs.writeFileSync(path.join(outDir, `${sName}.ts`), finalStr);
   indexExports.push(`export * as ${sName.toLowerCase()} from "./${sName}.js";`);
   indexExports.push(`export * from "./${sName}.js";`);
}

fs.writeFileSync(path.join(outDir, 'index.ts'), indexExports.join('\n'));
console.log("SQL Parser Done! Tables Extracted");
