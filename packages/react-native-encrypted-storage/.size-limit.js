module.exports = [
  {
    name: 'es module',
    path: '../../build/packages/react-native-encrypted-storage/index.js',
    limit: '360 B',
    import: '{ persist }',
    ignore: ['effector', 'effector-storage', 'react-native-encrypted-storage'],
    gzip: true,
  },
  {
    name: 'cjs module',
    path: '../../build/packages/react-native-encrypted-storage/index.cjs',
    limit: '326 B',
    // import: '{ persist }', // tree-shaking is not working with cjs
    ignore: ['effector', 'effector-storage', 'react-native-encrypted-storage'],
    gzip: true,
  },
]
