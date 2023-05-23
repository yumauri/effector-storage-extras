module.exports = [
  {
    name: 'es module',
    path: '../../build/packages/idb-keyval/index.js',
    limit: '467 B',
    import: '{ persist }',
    ignore: ['effector', 'effector-storage', 'idb-keyval'],
  },
  {
    name: 'cjs module',
    path: '../../build/packages/idb-keyval/index.cjs',
    limit: '663 B',
    // import: '{ persist }', // tree-shaking is not working with cjs
    ignore: ['effector', 'effector-storage', 'idb-keyval'],
  },
]
