module.exports = [
  {
    name: 'es module',
    path: '../../build/packages/idb-keyval/index.js',
    limit: '421 B',
    import: '{ persist }',
    ignore: ['effector', 'effector-storage', 'idb-keyval'],
  },
  {
    name: 'cjs module',
    path: '../../build/packages/idb-keyval/index.cjs',
    limit: '617 B',
    // import: '{ persist }', // tree-shaking is not working with cjs
    ignore: ['effector', 'effector-storage', 'idb-keyval'],
  },
]
