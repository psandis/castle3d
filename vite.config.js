import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  assetsInclude: ['**/*.glb', '**/*.fbx'],
  base: command === 'build' ? '/castle3d/' : '/',
  server: {
    port: 5181
  }
}))
