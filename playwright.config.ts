import { defineConfig } from "@playwright/test";

export default defineConfig({

    testDir: "./generated-tests",

    timeout: 60 * 1000,

    fullyParallel: true,

    forbidOnly: !!process.env.CI,

    retries: process.env.CI ? 1 : 0,

    workers: process.env.CI ? 4 : undefined,

    expect: {
        timeout: 10000
    },

    use: {

        headless: true,

        trace: "retain-on-failure",

        screenshot: "only-on-failure",

        video: "retain-on-failure",

        actionTimeout: 15000,

        navigationTimeout: 60000,

        ignoreHTTPSErrors: true

    },

    reporter: [

        [
            "html",
            {
                outputFolder: "playwright-report",
                open: "never"
            }
        ],

        [
            "json",
            {
                outputFile: "test-results/playwright-results.json"
            }
        ],

        [
            "junit",
            {
                outputFile: "test-results/junit.xml"
            }
        ]

    ]

});
