import fs from "fs";
import { discoverWebsite } from "./discovery";

async function run() {

    const path = "test-results/discovery.json";

    if (!fs.existsSync(path)) {
        throw new Error("Missing discovery.json - run discovery.spec.ts first");
    }

    const data = JSON.parse(fs.readFileSync(path, "utf8"));

    console.log("Discovery loaded successfully");
    console.log("Title:", data.title);
    console.log("URL:", data.url);
}

run();
