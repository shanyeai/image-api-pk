import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateRepository } from './public-data.mjs';
const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const result = validateRepository(root);
console.log(JSON.stringify(result, null, 2));
if (result.errors.length) process.exitCode = 1;
