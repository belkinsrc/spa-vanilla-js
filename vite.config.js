import { defineConfig } from 'vite';
import path from 'path';
import TemplatePlugin from './plugins/vite-template-plugin';

export default defineConfig({
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  plugins: [TemplatePlugin()],
});
