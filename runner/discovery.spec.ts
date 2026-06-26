import { test, expect } from "@playwright/test";
import fs from "fs";
import { discoverWebsite } from "../scripts/discovery";

test.describe("Enterprise QA Discovery Phase", () => {

    test("Discover Website", async ({ page }) => {

        const targetUrl = process.env.TARGET_URL;

        if (!targetUrl) {
            throw new Error("TARGET_URL environment variable is missing.");
        }

        //----------------------------------------------------
        // Navigate
        //----------------------------------------------------

        await page.goto(targetUrl, {
            waitUntil: "networkidle",
            timeout: 60000
        });

        //----------------------------------------------------
        // Run Discovery Engine
        //----------------------------------------------------

        const discovery = await discoverWebsite(page);

        //----------------------------------------------------
        // Ensure output folder exists
        //----------------------------------------------------

        fs.mkdirSync("test-results", {
            recursive: true
        });

        //----------------------------------------------------
        // Save Discovery JSON
        //----------------------------------------------------

        fs.writeFileSync(
            "test-results/discovery.json",
            JSON.stringify(discovery, null, 2)
        );

        //----------------------------------------------------
        // Basic Validation
        //----------------------------------------------------

        expect(discovery.title).toBeTruthy();

        expect(discovery.statistics.links).toBeGreaterThan(0);

        expect(discovery.statistics.buttons).toBeGreaterThanOrEqual(0);

        expect(discovery.statistics.inputs).toBeGreaterThanOrEqual(0);

        console.log("");

        console.log("====================================");

        console.log("Discovery Completed");

        console.log("====================================");

        console.log("Title :", discovery.title);

        console.log("URL   :", discovery.url);

        console.log("Buttons :", discovery.statistics.buttons);

        console.log("Inputs  :", discovery.statistics.inputs);

        console.log("Links   :", discovery.statistics.links);

        console.log("");

    });

});
