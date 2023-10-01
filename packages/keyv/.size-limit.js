module.exports = [
  {
    name: 'es module',
    path: '../../build/packages/keyv/index.js',
    limit: '410 B',
    import: '{ persist }',
    ignore: ['effector', 'effector-storage', 'keyv'],
  },
  {
    name: 'cjs module',
    path: '../../build/packages/keyv/index.cjs',
    limit: '383 B',
    // import: '{ persist }', // tree-shaking is not working with cjs
    ignore: ['effector', 'effector-storage', 'keyv'],
  },
]
