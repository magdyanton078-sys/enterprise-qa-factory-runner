import { chromium } from "@playwright/test";
import fs from "fs";
import { discoverWebsite } from "./discovery";

async function run() {

    const browser = await chromium.launch();

    const page = await browser.newPage();

    const url = process.env.TARGET_URL!;

    await page.goto(url,{
        waitUntil:"networkidle"
    });

    const result = await discoverWebsite(page);

    fs.mkdirSync("test-results",{recursive:true});

    fs.writeFileSync(
        "test-results/discovery.json",
        JSON.stringify(result,null,2)
    );

    console.log("Discovery completed");

    await browser.close();

}

run();
