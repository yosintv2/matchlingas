import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import obfuscator from 'rollup-plugin-obfuscator'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ...(process.env.NODE_ENV === 'production'
      ? [obfuscator({
          global: true,
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 0.75,
          deadCodeInjection: true,
          deadCodeInjectionThreshold: 0.4,
          debugProtection: true,
          debugProtectionInterval: 2000,
          disableConsoleOutput: true,
          identifierNamesGenerator: 'hexadecimal',
          log: false,
          numbersToExpressions: true,
          renameGlobals: false,
          selfDefending: true,
          simplify: false,
          splitStrings: true,
          splitStringsChunkLength: 10,
          stringArray: true,
          stringArrayEncoding: ['rc4'],
          stringArrayThreshold: 0.75,
          transformObjectKeys: true,
          unicodeEscapeSequence: false,
        })]
      : []),
  ],
})
