import fs from "fs";
import { chromium } from "@playwright/test";
import { discoverWebsite } from "./discovery";

async function run() {

    const targetUrl = process.env.TARGET_URL;

    if (!targetUrl) {
        throw new Error("TARGET_URL is missing");
    }

    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto(targetUrl, {
        waitUntil: "networkidle"
    });

    const result = await discoverWebsite(page);

    fs.mkdirSync("test-results", { recursive: true });

    fs.writeFileSync(
        "test-results/discovery.json",
        JSON.stringify(result, null, 2)
    );

    await browser.close();

    console.log("Discovery completed successfully");
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
