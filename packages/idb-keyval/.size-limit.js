module.exports = [
  {
    name: 'es module',
    path: '../../build/packages/idb-keyval/index.js',
    limit: '414 B',
    import: '{ persist }',
    ignore: ['effector', 'effector-storage', 'idb-keyval'],
    gzip: true,
  },
  {
    name: 'cjs module',
    path: '../../build/packages/idb-keyval/index.cjs',
    limit: '611 B',
    // import: '{ persist }', // tree-shaking is not working with cjs
    ignore: ['effector', 'effector-storage', 'idb-keyval'],
    gzip: true,
  },
]
