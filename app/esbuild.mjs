import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['./views/articles/autocompletes.js'],
  bundle: true,
  outfile: 'article-autocompletes.js',
})
