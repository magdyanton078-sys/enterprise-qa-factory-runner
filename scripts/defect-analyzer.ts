
import fs from "fs";

const RESULTS_FILE = "test-results/playwright-results.json";
const OUTPUT_FILE = "test-results/qa-analysis.json";

console.log("========================================");
console.log("Enterprise QA Agent - Defect Analyzer");
console.log("========================================");

if (!fs.existsSync(RESULTS_FILE)) {

    console.log("Playwright results not found.");
    console.log("Skipping defect analysis.");

    process.exit(0);
}

const results = JSON.parse(
    fs.readFileSync(
        RESULTS_FILE,
        "utf8"
    )
);

let total = 0;
let passed = 0;
let failed = 0;
let skipped = 0;

const defects: any[] = [];

function detectSeverity(message: string) {

    const text = message.toLowerCase();

    if (
        text.includes("timeout") ||
        text.includes("500") ||
        text.includes("503") ||
        text.includes("network")
    ) {

        return "Critical";
    }

    if (
        text.includes("locator") ||
        text.includes("selector")
    ) {

        return "High";
    }

    if (
        text.includes("expect") ||
        text.includes("assert")
    ) {

        return "Medium";
    }

    return "Low";
}

function estimateRootCause(message: string) {

    const text = message.toLowerCase();

    if (text.includes("timeout"))
        return "Application performance issue";

    if (text.includes("locator"))
        return "UI element changed";

    if (text.includes("selector"))
        return "DOM structure changed";

    if (text.includes("network"))
        return "Network instability";

    if (text.includes("expect"))
        return "Business rule mismatch";

    return "Unknown";
}

for (const suite of results.suites || []) {

    for (const spec of suite.specs || []) {

        for (const test of spec.tests || []) {

            total++;

            const status = test.status;

            if (status === "passed") {

                passed++;
            }

            else if (status === "failed") {

                failed++;

                const error =
                    test.error?.message ??
                    "Unknown Error";

                defects.push({

                    test: spec.title,

                    severity:
                        detectSeverity(error),

                    rootCause:
                        estimateRootCause(error),

                    message: error

                });

            }

            else {

                skipped++;

            }

        }

    }

}

const passRate =
    total === 0
        ? 0
        : Number(
              ((passed / total) * 100).toFixed(2)
          );

const summary = {

    executionTime:
        new Date().toISOString(),

    totalTests: total,

    passed,

    failed,

    skipped,

    passRate,

    releaseDecision:
        passRate >= 95
            ? "READY"
            : "NOT_READY",

    defects

};

fs.writeFileSync(

    OUTPUT_FILE,

    JSON.stringify(
        summary,
        null,
        2
    )

);

console.log("");
console.log("========== QA SUMMARY ==========");
console.log("Total Tests :", total);
console.log("Passed      :", passed);
console.log("Failed      :", failed);
console.log("Skipped     :", skipped);
console.log("Pass Rate   :", passRate + "%");
console.log("Defects     :", defects.length);
console.log("================================");
console.log("");
console.log("QA Analysis generated:");
console.log(OUTPUT_FILE);
