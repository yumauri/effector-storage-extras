module.exports = [
  {
    name: 'es module',
    path: '../../build/packages/react-native-async-storage/index.js',
    limit: '392 B',
    import: '{ persist }',
    ignore: [
      'effector',
      'effector-storage',
      '@react-native-async-storage/async-storage',
    ],
    gzip: true,
  },
  {
    name: 'cjs module',
    path: '../../build/packages/react-native-async-storage/index.cjs',
    limit: '361 B',
    // import: '{ persist }', // tree-shaking is not working with cjs
    ignore: [
      'effector',
      'effector-storage',
      '@react-native-async-storage/async-storage',
    ],
    gzip: true,
  },
]
