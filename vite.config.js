import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync } from 'fs'
import { globSync } from 'glob'
import JavaScriptObfuscator from 'javascript-obfuscator'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ...(process.env.NODE_ENV === 'production'
      ? [{
          name: 'post-obfuscate',
          closeBundle() {
            const files = globSync('dist/assets/*.js')
            for (const file of files) {
              const code = readFileSync(file, 'utf8')
              const result = JavaScriptObfuscator.obfuscate(code, {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 1,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 1,
                debugProtection: true,
                debugProtectionInterval: 4000,
                disableConsoleOutput: true,
                identifierNamesGenerator: 'mangled-shuffled',
                numbersToExpressions: true,
                renameGlobals: false,
                selfDefending: true,
                simplify: false,
                splitStrings: true,
                splitStringsChunkLength: 3,
                stringArray: true,
                stringArrayEncoding: ['rc4'],
                stringArrayThreshold: 1,
                transformObjectKeys: true,
                unicodeEscapeSequence: true,
                target: 'browser',
                shuffleStringArray: true,
                splitStringChunkOverlap: 2,
              })
              writeFileSync(file, result.getObfuscatedCode())
              console.log(`Obfuscated: ${file}`)
            }
          }
        }]
      : []),
  ],
})
