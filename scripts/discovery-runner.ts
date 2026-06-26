import fs from "fs";
import { chromium } from "@playwright/test";
import { discoverWebsite } from "./discovery";

async function run() {
    const targetUrl = process.env.TARGET_URL;

    if (!targetUrl) {
        throw new Error("TARGET_URL environment variable is missing.");
    }

    console.log("==================================");
    console.log("Enterprise Discovery Engine");
    console.log("==================================");
    console.log("Target:", targetUrl);

    // Create output folder
    fs.mkdirSync("test-results", { recursive: true });

    // Launch browser
    const browser = await chromium.launch({
        headless: true
    });

    const page = await browser.newPage({
        viewport: {
            width: 1440,
            height: 900
        }
    });

    try {
        console.log("Opening website...");

        await page.goto(targetUrl, {
            waitUntil: "networkidle",
            timeout: 60000
        });

        console.log("Running discovery...");

        const discovery = await discoverWebsite(page);

        fs.writeFileSync(
            "test-results/discovery.json",
            JSON.stringify(discovery, null, 2)
        );

        console.log("Discovery completed successfully.");
        console.log("Output: test-results/discovery.json");

        console.log("");
        console.log("Summary");
        console.log("--------------------------");
        console.log("Title      :", discovery.title);
        console.log("URL        :", discovery.url);
        console.log("Buttons    :", discovery.statistics.buttons);
        console.log("Links      :", discovery.statistics.links);
        console.log("Forms      :", discovery.statistics.forms);
        console.log("Inputs     :", discovery.statistics.inputs);
        console.log("Images     :", discovery.statistics.images);
        console.log("--------------------------");

    } finally {
        await browser.close();
    }
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
