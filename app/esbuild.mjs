import * as esbuild from 'esbuild'

// await esbuild.build({
//   entryPoints: ['./views/articles/autocompletes.js'],
//   bundle: true,
//   outfile: 'article-autocompletes.js',
// })
await esbuild.build({
  entryPoints: ['./bundles/*.js'],
  bundle: true,
  outfile: 'bundles.js',
})
