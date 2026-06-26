import fs from "fs";
import { discoverWebsite } from "./discovery";
import type { Page } from "@playwright/test";

async function run() {
    console.log("Starting Discovery Runner...");

    const targetUrl = process.env.TARGET_URL;

    if (!targetUrl) {
        throw new Error("TARGET_URL is missing");
    }

    // This file is NOT responsible for navigation
    // It only validates output exists after discovery.spec.ts runs

    const path = "test-results/discovery.json";

    if (!fs.existsSync(path)) {
        throw new Error("discovery.json was not created. Run discovery.spec.ts first.");
    }

    const discovery = JSON.parse(fs.readFileSync(path, "utf8"));

    console.log("Discovery Loaded Successfully");
    console.log("Title:", discovery.title);
    console.log("URL:", discovery.url);

    console.log("Runner completed");
}

run();
