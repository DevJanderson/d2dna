import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginZod } from '@kubb/plugin-zod'

export default defineConfig({
  name: 'tucuxi-api',
  root: '.',
  input: {
    path: './openapi/tucuxi-api.json'
  },
  output: {
    path: './generated/tucuxi',
    clean: true,
    // OBRIGATÓRIO: Remove extensão .ts dos imports
    // Compatibilidade com bundlers e verbatimModuleSyntax
    extension: {
      '.ts': ''
    }
  },
  plugins: [
    pluginOas(),
    pluginTs({
      output: {
        path: './types',
        barrelType: 'named'
      },
      group: {
        type: 'tag',
        name: ({ group }) => `${group}Types`
      },
      enumType: 'enum',
      dateType: 'string'
    }),
    pluginZod({
      output: {
        path: './zod',
        barrelType: 'named'
      },
      group: {
        type: 'tag',
        name: ({ group }) => `${group}Schemas`
      },
      // IMPORTANTE: NÃO usar typed, inferred ou importType
      // Essas opções geram imports incompatíveis com verbatimModuleSyntax
      dateType: 'string'
    })
  ]
})
