// Frontend/cypress.config.ts
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    // point at your Vite dev server
    baseUrl: 'http://localhost:5173',
    // where your specs live
    specPattern: 'cypress/e2e/**/*.cy.ts',
    // your support file
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      // (optional) you can spawn your dev server here
      return config
    },
  },
})
