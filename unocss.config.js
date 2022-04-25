import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss'
import { presetTypography } from '@unocss/preset-typography'

export default defineConfig({
  include: [/\.vue$/, /\.vue\?vue/, /\.[jt]sx?$/, /.html$/],
  presets: [
    presetUno({
      dark: 'class',
    }),
    presetTypography(),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  transformers: [transformerDirectives()]
})
