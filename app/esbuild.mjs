import * as esbuild from 'esbuild'

// await esbuild.build({
//   entryPoints: ['./views/inventaris/autocompletes.js'],
//   bundle: true,
//   outfile: 'inventari-autocompletes.js',
// })
await esbuild.build({
  entryPoints: ['./bundles/*.js'],
  bundle: true,
  outfile: 'bundles.js',
})
