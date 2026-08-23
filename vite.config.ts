/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  // Inlines all JS/CSS into index.html. Plain `<script type="module" src=...>`
  // chunks fail under file:// in Chromium (module fetches are blocked by
  // CORS from a null origin) -- this app must open by double-clicking
  // dist/index.html with no server, so everything has to be one file.
  plugins: [react(), viteSingleFile()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
