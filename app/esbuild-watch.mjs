import * as esbuild from 'esbuild'
import { readFile } from 'fs/promises';

const tsconfig = JSON.parse(await readFile('./tsconfig.json', 'utf8'));
 const aliases = Object.entries(tsconfig.compilerOptions.paths).reduce((acc, [alias, [path]]) => {
   const key = alias.replace('/*', '');
   const value = path.replace('/*', '');
   acc[key] = value;
   return acc;
 }, {});

await esbuild.build({
  entryPoints: ['./src/bundles/*.ts'],
  bundle: true,
  outfile: 'bundles.js',
  watch: true,
  platform: 'browser',
  alias: aliases,
}).catch(() => process.exit(1))
