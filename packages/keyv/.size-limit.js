module.exports = [
  {
    name: 'es module',
    path: '../../build/packages/keyv/index.js',
    limit: '412 B',
    import: '{ persist }',
    ignore: ['effector', 'effector-storage', 'keyv'],
    gzip: true,
  },
  {
    name: 'cjs module',
    path: '../../build/packages/keyv/index.cjs',
    limit: '383 B', // loose limit
    // import: '{ persist }', // tree-shaking is not working with cjs
    ignore: ['effector', 'effector-storage', 'keyv'],
    gzip: true,
  },
]
