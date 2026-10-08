// Temporary, isolated capture entry points. Never include them in a release build.
import { readFile, writeFile, copyFile, constants } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const here=path.dirname(fileURLToPath(import.meta.url));
const app=path.resolve(here,'../../../pkg/app');
const original=await readFile(path.join(app,'index.html'),'utf8');
await writeFile(path.join(app,'storefront-seed.html'),original.replace('/src/index.tsx','/@fs/'+path.join(here,'seed.ts')),{flag:'wx'});
await copyFile(path.join(here,'capture.html'),path.join(app,'storefront-capture.html'),constants.COPYFILE_EXCL);
console.log('Capture entry points created. Use an isolated localhost port; remove both files after capture.');
