import {
  defineConfig,
  devices,
} from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  timeout: 60_000,

  fullyParallel: false,
  workers: 1,

  reporter: "html",

  use: {
    baseURL: "http://localhost:5175",

    trace: "on-first-retry",

    screenshot: "only-on-failure",
  },

  webServer: {
    command:
      "npm run dev -- --host 0.0.0.0 --port 5175",

    url: "http://localhost:5175",

    reuseExistingServer: true,

    timeout: 120_000,
  },

  projects: [
    {
      name: "chromium",

      use: {
        ...devices["Desktop Chrome"],
      },
    },

    {
      name: "mobile",

      use: {
        ...devices["Pixel 5"],
      },
    },
  ],
});