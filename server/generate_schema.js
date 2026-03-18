import fs from 'fs';
import path from 'path';

const sqlContent = fs.readFileSync('new Table Agro.sql', 'utf8');

const tablesContent = sqlContent.split('CREATE TABLE ').slice(1);

const tables = [];

for (const tableSql of tablesContent) {
  const headerEnd = tableSql.indexOf('(');
  const fullName = tableSql.substring(0, headerEnd).trim();
  let schemaName = 'public';
  let tableName = fullName;
  if (fullName.includes('.')) {
    [schemaName, tableName] = fullName.split('.');
  }
  
  // Find the matching closing bracket for the CREATE TABLE statement
  let bracketsCount = 0;
  let endBracket = -1;
  for (let i = headerEnd; i < tableSql.length; i++) {
    if (tableSql[i] === '(') bracketsCount++;
    if (tableSql[i] === ')') {
      bracketsCount--;
      if (bracketsCount === 0) {
        endBracket = i;
        break;
      }
    }
  }
  const columnsStr = tableSql.substring(headerEnd + 1, endBracket);
  
  let cols = [];
  let current = '';
  let brackets = 0;
  for (let i = 0; i < columnsStr.length; i++) {
    const char = columnsStr[i];
    if (char === '(') brackets++;
    if (char === ')') brackets--;
    if (char === ',' && brackets === 0) {
      cols.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) cols.push(current.trim());
  
  const columns = cols.map(col => {
    col = col.replace(/\n/g, ' ').trim();
    if (!col) return null;
    const parts = col.split(/\s+/);
    const name = parts[0];
    const typeAndRest = col.substring(name.length).trim();
    
    let refTable = null;
    let refCol = null;
    const refMatch = typeAndRest.match(/REFERENCES\s+([a-zA-Z0-9_.]+)\s*\(\s*([a-zA-Z0-9_]+)\s*\)/i);
    if (refMatch) {
      refTable = refMatch[1];
      refCol = refMatch[2];
    }
    
    const isPk = /PRIMARY KEY/i.test(typeAndRest);
    const isUnique = /UNIQUE/i.test(typeAndRest);
    
    const typeMatch = typeAndRest.match(/^([a-zA-Z0-9_]+(?:\(\s*\d+(?:\s*,\s*\d+)?\s*\))?)/i);
    const type = typeMatch ? typeMatch[1] : '';

    return {
      name,
      type,
      isPk,
      isUnique,
      refTable,
      refCol,
      rawType: typeAndRest
    };
  }).filter(Boolean);

  tables.push({
    schemaName,
    tableName,
    columns
  });
}

function getDrizzleType(sqlType, colName) {
  const t = sqlType.toUpperCase();
  if (t.startsWith('SERIAL')) return `serial("${colName}")`;
  if (t.startsWith('BIGSERIAL')) return `bigserial("${colName}", { mode: "number" })`;
  if (t.startsWith('VARCHAR') || t.startsWith('CHAR')) {
    const match = t.match(/\((\d+)\)/);
    if (match) return `varchar("${colName}", { length: ${match[1]} })`;
    return `varchar("${colName}")`;
  }
  if (t.startsWith('TEXT')) return `text("${colName}")`;
  if (t.startsWith('INTEGER') || t.startsWith('INT')) return `integer("${colName}")`;
  if (t.startsWith('BIGINT')) return `bigint("${colName}", { mode: "number" })`;
  if (t.startsWith('DECIMAL') || t.startsWith('NUMERIC')) {
    const match = t.match(/\((\d+),\s*(\d+)\)/);
    if (match) return `decimal("${colName}", { precision: ${match[1]}, scale: ${match[2]} })`;
    const singleMatch = t.match(/\((\d+)\)/);
    if (singleMatch) return `decimal("${colName}", { precision: ${singleMatch[1]}, scale: 0 })`;
    return `decimal("${colName}")`;
  }
  if (t.startsWith('TIMESTAMP') || t.startsWith('DATETIME') || t.startsWith('DATE')) {
    return `timestamp("${colName}", { mode: "date" })`;
  }
  if (t.startsWith('BYTEA')) return `customType({ dataType() { return "bytea"; } })("${colName}")`;
  
  return `text("${colName}")`;
}

const schemas = {};
tables.forEach(t => {
  if (!schemas[t.schemaName]) schemas[t.schemaName] = [];
  schemas[t.schemaName].push(t);
});

if (!fs.existsSync('src/db/schema')) {
  fs.mkdirSync('src/db/schema', { recursive: true });
}

for (const [schemaName, schemaTables] of Object.entries(schemas)) {
  let content = [];
  const foreignImports = new Set();
  
  content.push(`import { relations } from "drizzle-orm";`);
  content.push(`import { pgSchema, integer, varchar, text, timestamp, decimal, serial, bigserial, bigint, customType } from "drizzle-orm/pg-core";\n`);
  
  content.push(`export const ${schemaName.toLowerCase()}Schema = pgSchema("${schemaName}");\n`);
  
  let relationsContent = [];

  for (const table of schemaTables) {
    const tableName = table.tableName;
    const structName = tableName; // using actual table name
    
    content.push(`export const ${structName} = ${schemaName.toLowerCase()}Schema.table("${tableName}", {`);
    
    let tableRelationsFnBody = [];
    
    for (const col of table.columns) {
      let dType = getDrizzleType(col.type, col.name);
      let modifiers = [];
      if (col.isPk) modifiers.push(`.primaryKey()`);
      if (col.isUnique) modifiers.push(`.unique()`);
      
      if (col.refTable) {
        let rs = schemaName;
        let rt = col.refTable;
        if (rt.includes('.')) {
          [rs, rt] = rt.split('.');
        }
        
        // Ensure the imported file is relative to 'src/db/schema'.
        if (rs !== schemaName) {
          foreignImports.add(`import { ${rt} } from "./${rs}.js";`);
        }
        
        modifiers.push(`.references(() => ${rt}.${col.refCol})`);
        
        let relName = col.name.replace(/_ID$/i, '').toLowerCase();
        if (!relName) relName = 'ref';
        
        // Uniquify
        let count = tableRelationsFnBody.filter(r => r.name === relName).length;
        if (count > 0) relName += "_" + count;
        
        tableRelationsFnBody.push({
          name: relName, 
          text: `  ${relName}: one(${rt}, { fields: [${structName}.${col.name}], references: [${rt}.${col.refCol}] }),`
        });
      }
      
      let finalModifiers = modifiers.join('');
      if (dType.startsWith('customType')) {
         dType = dType.replace(' customType(', 'customType<{ data: Buffer, driverData: Buffer }>(');
      }
      content.push(`  ${col.name}: ${dType}${finalModifiers},`);
    }
    
    content.push(`});\n`);
    
    if (tableRelationsFnBody.length > 0) {
      relationsContent.push(`export const ${structName}Relations = relations(${structName}, ({ one, many }) => ({`);
      tableRelationsFnBody.forEach(r => {
        relationsContent.push(r.text);
      });
      relationsContent.push(`}));\n`);
    }
  }
  
  const finalContentArray = [
    Array.from(foreignImports).join("\n"),
    content.join("\n"),
    relationsContent.join("\n")
  ].filter(x => x);

  const finalContent = finalContentArray.join("\n\n");

  fs.writeFileSync(`src/db/schema/${schemaName}.ts`, finalContent);
  console.log(`Generated ${schemaName}.ts`);
}

let indexExports = [];
for (const schemaName of Object.keys(schemas)) {
  indexExports.push(`export * as ${schemaName} from "./${schemaName}.js";`);
  indexExports.push(`export * from "./${schemaName}.js";`);
}
fs.writeFileSync('src/db/schema/index.ts', indexExports.join("\n"));
console.log('Generated index.ts');
