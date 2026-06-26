import fs from "fs";
import { chromium } from "@playwright/test";
Run set -e
  set -e
  npx ts-node scripts/discovery-runner.ts
  
  echo "Validating discovery output..."
  if [ ! -f test-results/discovery.json ]; then
    echo "ERROR: discovery.json was not created"
    exit 1
  fi
  shell: /usr/bin/bash -e {0}
  env:
    TARGET_URL: https://www.amazon.eg/-/en/
Error: Cannot find module '/home/runner/work/enterprise-qa-factory-runner/enterprise-qa-factory-runner/scripts/discovery' imported from /home/runner/work/enterprise-qa-factory-runner/enterprise-qa-factory-runner/scripts/discovery-runner.ts
    at finalizeResolution (node:internal/modules/esm/resolve:275:11)
    at moduleResolve (node:internal/modules/esm/resolve:861:10)
    at defaultResolve (node:internal/modules/esm/resolve:985:11)
    at ModuleLoader.#cachedDefaultResolve (node:internal/modules/esm/loader:747:20)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:724:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:320:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:182:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///home/runner/work/enterprise-qa-factory-runner/enterprise-qa-factory-runner/scripts/discovery'
}
Error: Process completed with exit code 1.

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
