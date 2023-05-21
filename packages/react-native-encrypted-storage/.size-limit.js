module.exports = [
  {
    name: 'es module',
    path: '../../build/packages/react-native-encrypted-storage/index.js',
    limit: '362 B',
    import: '{ persist }',
    ignore: ['effector', 'effector-storage', 'react-native-encrypted-storage'],
  },
  {
    name: 'cjs module',
    path: '../../build/packages/react-native-encrypted-storage/index.cjs',
    limit: '329 B',
    // import: '{ persist }', // tree-shaking is not working with cjs
    ignore: ['effector', 'effector-storage', 'react-native-encrypted-storage'],
  },
]
