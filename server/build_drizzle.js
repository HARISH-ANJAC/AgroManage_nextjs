import fs from 'fs';
import path from 'path';

const rawData = fs.readFileSync('Prime_Table_structure_to_Json_format.json', 'utf8');
const dbMeta = JSON.parse(rawData);

const outDir = 'src/db/schema';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function getDrizzleType(colName, colDef) {
  const type = colDef.type.toLowerCase();
  let fn = '';

  if (type === 'int') {
    fn = colDef.identity ? `serial("${colName}")` : `integer("${colName}")`;
  } else if (type === 'bigint') {
     fn = colDef.identity ? `bigserial("${colName}", { mode: 'number' })` : `bigint("${colName}", { mode: 'number' })`;
  } else if (type.startsWith('varchar')) {
    const match = type.match(/\((max|\d+)\)/);
    if (match && match[1] !== 'max') {
        fn = `varchar("${colName}", { length: ${match[1]} })`;
    } else {
        fn = `text("${colName}")`; // max
    }
  } else if (type.startsWith('nvarchar')) {
    const match = type.match(/\((max|\d+)\)/);
    if (match && match[1] !== 'max') {
        fn = `varchar("${colName}", { length: ${match[1]} })`;
    } else {
        fn = `text("${colName}")`;
    }
  } else if (type.startsWith('decimal') || type.startsWith('numeric')) {
    const match = type.match(/\((\d+),\s*(\d+)\)/);
    if (match) {
        fn = `numeric("${colName}", { precision: ${match[1]}, scale: ${match[2]} })`;
    } else {
        fn = `numeric("${colName}")`;
    }
  } else if (type === 'datetime' || type === 'date') {
    fn = `timestamp("${colName}", { mode: 'date' })`;
  } else if (type.startsWith('varbinary')) {
    fn = `bytea("${colName}")`;
  } else {
    fn = `text("${colName}")`; // fallback
  }

  // modifiers
  if (colDef.primary_key && !colDef.identity) fn += '.primaryKey()'; // serial/bigserial already implies primary key effectively, but in Drizzle .primaryKey() works fine on serial too. Actually, for serial, we must append .primaryKey() for drizzle-kit
  if (colDef.primary_key) {
      if (!fn.includes('.primaryKey()')) fn += '.primaryKey()';
  }
  if (colDef.unique) fn += '.unique()';
  if (!colDef.nullable && !colDef.identity && !colDef.primary_key) fn += '.notNull()';

  return fn;
}

const allTablesMap = {}; // "stomaster.tbl_..." -> { schemaName, tableName }

for (const [sName, sMeta] of Object.entries(dbMeta.schemas)) {
    for (const [tName] of Object.entries(sMeta.tables)) {
        allTablesMap[`${sName.toLowerCase()}.${tName.toLowerCase()}`] = {
            schema: sName,
            table: tName
        };
    }
}

const schemaNames = Object.keys(dbMeta.schemas);
const indexExports = [];

for (const schemaName of schemaNames) {
  const schemaVar = schemaName.toLowerCase();
  const schemaTables = dbMeta.schemas[schemaName].tables;

  const imports = new Set([
      `import { relations } from "drizzle-orm";`,
      `import { pgSchema, integer, serial, bigint, bigserial, varchar, text, numeric, timestamp, customType } from "drizzle-orm/pg-core";`
  ]);

  let customTypes = `const bytea = customType<{ data: Buffer, notNull: false, default: false }>({
  dataType() { return 'bytea'; },
});\n\n`;

  let content = `export const ${schemaVar}Schema = pgSchema("${schemaName.toLowerCase()}");\n\n`;

  let relationsContent = [];

  for (const [tableName, tableMeta] of Object.entries(schemaTables)) {
    content += `export const ${tableName} = ${schemaVar}Schema.table("${tableName}", {\n`;

    const foreignKeysForRelations = [];

    for (const [colName, colDef] of Object.entries(tableMeta.columns)) {
      let dType = getDrizzleType(colName, colDef);

      if (colDef.foreign_key) {
         const refFull = colDef.foreign_key.table.toLowerCase(); // e.g. "stomaster.tbl_currency_master"
         const refCol = colDef.foreign_key.column;

         const refInfo = allTablesMap[refFull];
         if (refInfo) {
             if (refInfo.schema !== schemaName) {
                 const refSchemaVar = refInfo.schema.toLowerCase();
                 imports.add(`import * as ${refSchemaVar}Schema from "./${refInfo.schema}.js";`);
                  dType += `.references(() => ${refSchemaVar}Schema.${refInfo.table}.${refCol})`;
                  foreignKeysForRelations.push({
                      col: colName,
                      refTable: `${refSchemaVar}Schema.${refInfo.table}`,
                      refTableUnqualified: refInfo.table,
                      refCol,
                      relName: refInfo.table.replace(/^tbl_/i,'').toLowerCase()
                  });
             } else {
                  dType += `.references(() => ${refInfo.table}.${refCol})`;
                   foreignKeysForRelations.push({
                      col: colName,
                      refTable: `${refInfo.table}`,
                      refTableUnqualified: refInfo.table,
                      refCol,
                      relName: refInfo.table.replace(/^tbl_/i,'').toLowerCase()
                  });
             }
         } else {
             // fallback
             console.log("Missing cross ref:", refFull);
         }
      }

      content += `  ${colName}: ${dType},\n`;
    }

    content += `});\n\n`;

    if (foreignKeysForRelations.length > 0) {
        relationsContent.push(`export const ${tableName}Relations = relations(${tableName}, ({ one, many }) => ({`);
        
        let usedRelNames = new Set();
        foreignKeysForRelations.forEach((fk, idx) => {
           let rName = fk.relName;
           if (usedRelNames.has(rName)) {
               rName = rName + '_' + fk.col.toLowerCase();
           }
           usedRelNames.add(rName);
           relationsContent.push(`  ${rName}: one(${fk.refTableUnqualified}, { fields: [${tableName}.${fk.col}], references: [${fk.refTable}.${fk.refCol}] }),`);
        });

        relationsContent.push(`}));\n\n`);
    }
  }

  const finalStr = [
      Array.from(imports).join('\n'),
      customTypes,
      content,
      relationsContent.join('\n')
  ].join('\n\n');

  fs.writeFileSync(path.join(outDir, `${schemaName}.ts`), finalStr);
  indexExports.push(`export * as ${schemaName} from "./${schemaName}.js";`);
  indexExports.push(`export * from "./${schemaName}.js";`);
}

fs.writeFileSync(path.join(outDir, 'index.ts'), indexExports.join('\n'));
console.log("Done");
