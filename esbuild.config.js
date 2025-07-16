import { build } from 'esbuild';

/**
 * Modern, strict, and minimal esbuild config for TypeScript libraries
 */
const isProd = process.env.NODE_ENV === 'production';

build({
  entryPoints: ['src/index.ts'],
  outdir: 'dist',
  bundle: true,
  minify: isProd,
  sourcemap: true,
  target: ['es2020'],
  format: 'esm',
  platform: 'neutral',
  splitting: true,
  treeShaking: true,
  external: [],
  tsconfig: 'tsconfig.json',
  logLevel: 'info',
}).catch(() => process.exit(1));
