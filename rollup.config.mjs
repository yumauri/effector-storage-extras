import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import command from 'rollup-plugin-command'
import generateDts from 'rollup-plugin-dts'
import generatePackageJson from 'rollup-plugin-generate-package-json'

// this is weird, but if I dynamically import package.json, node complains
//   > TypeError: Module ... needs an import assertion of type "json"
// if I add assertion to import, node complains
//   > ExperimentalWarning: Import assertions are not a stable feature of the JavaScript language.
//   > Avoid relying on their current behavior and syntax as those might change in a future version of Node.js.
// so I figured I'll just use node's old good require for that:
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

const ROOT = dirname(fileURLToPath(import.meta.url))
const ROOT_PACKAGE = resolve(ROOT, 'package.json')
const ROOT_PACKAGE_JSON = require(ROOT_PACKAGE)

const WORKSPACE = process.cwd()
const WORKSPACE_NAME = WORKSPACE.split('/').pop()
const WORKSPACE_PACKAGE = resolve(WORKSPACE, 'package.json')
const WORKSPACE_PACKAGE_JSON = require(WORKSPACE_PACKAGE)

const SRC = resolve(WORKSPACE, 'src')
const BUILD = resolve(ROOT, 'build', 'packages', WORKSPACE_NAME)

const external = [
  'effector',
  'effector-storage',
  ...Object.keys(WORKSPACE_PACKAGE_JSON.dependencies || {}),
]

const src = () => ({
  input: `${SRC}/index.ts`,
  output: [
    {
      file: `${BUILD}/index.cjs`,
      format: 'cjs',
      sourcemap: process.env.NODE_ENV === 'production',
      externalLiveBindings: false,
      esModule: false,
      exports: 'named',
    },
    {
      file: `${BUILD}/index.js`,
      format: 'es',
      sourcemap: process.env.NODE_ENV === 'production',
      exports: 'named',
    },
  ],
  external,
  plugins: [
    // resolve typescript files
    nodeResolve({
      extensions: ['.ts'],
    }),

    // apply babel transformations
    babel({
      extensions: ['.ts'],
      babelHelpers: 'bundled',
      presets: ['@babel/preset-typescript'],
      plugins: ['@babel/plugin-transform-block-scoping'],
    }),

    // minify for production
    process.env.NODE_ENV === 'production' &&
      terser({
        compress: {
          ecma: 2017,
          keep_fargs: false,
          passes: 2,
        },
        format: {
          comments: false,
        },
      }),

    // generate package.json files
    generatePackageJson({
      baseContents: (pkg) => ({
        name: pkg.name,
        description: pkg.description,
        version: pkg.version,
        author: pkg.author || ROOT_PACKAGE_JSON.author,
        license: ROOT_PACKAGE_JSON.license,
        repository: ROOT_PACKAGE_JSON.repository,
        bugs: ROOT_PACKAGE_JSON.bugs,
        homepage:
          ROOT_PACKAGE_JSON.homepage + '/tree/main/packages/' + WORKSPACE_NAME,
        keywords: [...ROOT_PACKAGE_JSON.keywords, ...pkg.keywords],
        peerDependencies: {
          effector: '>=22.0.0',
        },

        // cjs + esm magic
        type: 'module',
        sideEffects: false,
        types: 'index.d.ts',
        module: 'index.js',
        main: 'index.cjs',
        'react-native': 'index.js',
        exports: {
          './package.json': './package.json',
          '.': {
            import: {
              types: './index.d.ts',
              default: './index.js',
            },
            require: {
              types: './index.d.cts',
              default: './index.cjs',
            },
          },
        },
      }),
      additionalDependencies: {
        'effector-storage': '^6.0.0',
      },
    }),

    // copy license and readme
    command([
      `cp ${ROOT}/LICENSE ${BUILD}/`,
      `cp ${WORKSPACE}/README.md ${BUILD}/`,
    ]),
  ],
})

const dts = () => ({
  input: `${SRC}/index.ts`,
  output: [
    {
      file: `${BUILD}/index.d.ts`,
      format: 'es',
    },
  ],
  external,
  plugins: [
    generateDts({ respectExternal: true }),
    command(
      [
        `pnpm exec flowgen ${BUILD}/index.d.ts --add-flow-header --no-jsdoc --output-file ${BUILD}/index.js.flow`,
        `pnpm exec prettier --write ${BUILD}/index.d.ts ${BUILD}/index.js.flow`,
      ],
      { wait: true }
    ),
  ],
})

const cjsdts = () => ({
  input: `${SRC}/index.ts`,
  output: [
    {
      file: `${BUILD}/index.d.cts`,
      format: 'es',
    },
  ],
  external,
  plugins: [
    generateDts({ respectExternal: true }),
    command([`pnpm exec prettier --write ${BUILD}/index.d.cts`], {
      wait: true,
    }),
  ],
})

export default [src(), dts(), cjsdts()]
