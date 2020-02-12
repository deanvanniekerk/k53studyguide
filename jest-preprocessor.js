const path = require('path')
const tsc = require('typescript')
const tsConfig = {
  compilerOptions: {
    target: 'es6',
    module: 'commonjs',
    jsx: 'react',
  },
}

//var transform = require('transform-jest-deps')

/* const aliases = [
  { key: 'react-native-vector-icons', value: '@expo/vector-icons' },
] */

module.exports = {
  process(src, path) {
    if (path.endsWith('.ts') || path.endsWith('.tsx')) {
      var transpiled = tsc.transpileModule(src, {
        compilerOptions: tsConfig.compilerOptions,
        fileName: path,
      })

      /*       srcTransformed = transform(transpiled.outputText, require => {
        for (let i = 0; i < aliases.length; i++) {
          const alias = aliases[i]
          const regex = new RegExp(`^${alias.key}$|^${alias.key}(\\/)`)
          if (regex.test(require)) {
            return require.replace(regex, `${alias.value}$1`)
          }
        }
        return require
      }) */

      return transpiled.outputText //srcTransformed
    }

    return src
  },
}
