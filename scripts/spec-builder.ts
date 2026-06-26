import fs from "fs";

const generatedDir = "generated-tests";
const inputFile = "test-results/test-cases.json";

// تأكيد وجود folder
if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
}

// تحميل test cases بشكل آمن
let testCases: any[] = [];

try {
    if (fs.existsSync(inputFile)) {
        testCases = JSON.parse(fs.readFileSync(inputFile, "utf8"));
    } else {
        console.log("No test cases found, skipping generation");
        process.exit(0);
    }
} catch (error) {
    console.error("Failed to read test cases:", error);
    process.exit(1);
}
let output = `
import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL!;

test.beforeEach(async ({ page }) => {
    await page.goto(TARGET_URL, {
        waitUntil: 'networkidle',
        timeout: 60000
    });
});

`;
function safeText(value: any, fallback = "Unnamed Test") {
    return typeof value === "string" && value.trim().length > 0
        ? value
        : fallback;
}

function sanitizeId(value: any) {
    return typeof value === "string"
        ? value.replace(/[^a-zA-Z0-9-_]/g, "_")
        : "test";
}

for (const tc of testCases) {

    const testId = sanitizeId(tc.id);
    const testTitle = safeText(tc.title, "Generated Test");

    output += `
test('${testId} - ${testTitle}', async ({ page }) => {
`;

    // Always start from a stable state
    output += `
    await page.waitForLoadState('networkidle');
`;

    /**
     * ======================================================
     * SMART ACTION ENGINE (NO MORE SWITCH-CASE LIMITATION)
     * ======================================================
     */

    const type = (tc.type || "").toLowerCase();

    // SMOKE TESTS
    if (type.includes("smoke")) {
        output += `
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator("body")).toBeVisible();
`;
    }

    // NAVIGATION TESTS
    else if (type.includes("navigation")) {
        output += `
    const links = page.locator('a');
    expect(await links.count()).toBeGreaterThan(0);
`;
    }

    // FORM TESTS
    else if (type.includes("form")) {
        output += `
    const inputs = page.locator('input,textarea,select');
    expect(await inputs.count()).toBeGreaterThan(0);
`;
    }

    // BUTTON TESTS
    else if (type.includes("button")) {
        output += `
    const buttons = page.locator('button,[role="button"]');
    expect(await buttons.count()).toBeGreaterThan(0);
`;
    }

    // ACCESSIBILITY TESTS
    else if (type.includes("access")) {
        output += `
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        expect(alt).not.toBeNull();
    }
`;
    }

    // PERFORMANCE TESTS
    else if (type.includes("performance")) {
        output += `
    const start = Date.now();

    await page.reload({ waitUntil: 'networkidle' });

    const duration = Date.now() - start;

    expect(duration).toBeLessThan(10000);
`;
    }

    // SEO TESTS
    else if (type.includes("seo")) {
        output += `
    const description = page.locator('meta[name="description"]');
    expect(await description.count()).toBeGreaterThan(0);
`;
    }

    // RESPONSIVE TESTS
    else if (type.includes("responsive")) {
        output += `
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();
    await expect(page.locator("body")).toBeVisible();
`;
    }

    // IMAGE TESTS
    else if (type.includes("image")) {
        output += `
    const imgs = page.locator("img");
    expect(await imgs.count()).toBeGreaterThan(0);
`;
    }

    // DEFAULT FALLBACK
    else {
        output += `
    await expect(page.locator("body")).toBeVisible();
`;
    }

    output += `
});
`;
}
function getSeverity(type: string) {
    const t = (type || "").toLowerCase();

    if (t.includes("security") || t.includes("access")) return "HIGH";
    if (t.includes("performance") || t.includes("seo")) return "MEDIUM";
    return "LOW";
}

function getTags(tc: any) {
    const tags = [];

    if (tc.type) tags.push(tc.type.toLowerCase());
    if (tc.priority) tags.push(tc.priority.toLowerCase());
    if (tc.module) tags.push(tc.module.toLowerCase());

    return tags;
}
const severity = getSeverity(tc.type);
const tags = getTags(tc);
const description = safeText(tc.description, tc.title);
output += `
test.describe('${severity} - ${testTitle}', () => {

test('${testId}', async ({ page }) => {

    // ======================================================
    // TEST METADATA
    // ======================================================
    console.log("Executing Test:", {
        id: "${testId}",
        title: "${testTitle}",
        severity: "${severity}",
        tags: ${JSON.stringify(tags)}
    });

    await page.waitForLoadState('networkidle');

`;
output += `
    // TEST DESCRIPTION
    // ${description}
`;
output += `
});
});
`;
function buildAssertions(tc: any) {
    const type = (tc.type || "").toLowerCase();
    const assertions: string[] = [];

    // Always safe baseline
    assertions.push(`await expect(page.locator("body")).toBeVisible();`);
        if (type.includes("navigation")) {
        assertions.push(`
const links = page.locator('a');
expect(await links.count()).toBeGreaterThan(0);
        `.trim());
    }

    if (type.includes("form")) {
        assertions.push(`
const inputs = page.locator('input,textarea,select');
expect(await inputs.count()).toBeGreaterThan(0);
        `.trim());
    }

    if (type.includes("button")) {
        assertions.push(`
const buttons = page.locator('button,[role="button"]');
expect(await buttons.count()).toBeGreaterThan(0);
        `.trim());
    }
        if (type.includes("security") || type.includes("access")) {
        assertions.push(`
const images = page.locator('img');
const count = await images.count();

for (let i = 0; i < count; i++) {
    const alt = await images.nth(i).getAttribute('alt');
    expect(alt).not.toBeNull();
}
        `.trim());
    }
        if (type.includes("performance")) {
        assertions.push(`
const start = Date.now();

await page.reload({ waitUntil: 'networkidle' });

const duration = Date.now() - start;

expect(duration).toBeLessThan(10000);
        `.trim());
    }
        if (type.includes("seo")) {
        assertions.push(`
const description = page.locator('meta[name="description"]');
expect(await description.count()).toBeGreaterThan(0);
        `.trim());
    }
        return assertions;
}
const assertions = buildAssertions(tc);

output += `
    // ======================================================
    // SMART ASSERTIONS ENGINE
    // ======================================================
`;

for (const a of assertions) {
    output += `
    ${a}
`;
}
import fs from "fs";

const resultsPath = "test-results";
const discoveryFile = `${resultsPath}/discovery.json`;
const qaFile = `${resultsPath}/qa-results.json`;

function safeRead(file: string) {
    try {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
        return null;
    }
}

const discovery = safeRead(discoveryFile);
const qaResults = safeRead(qaFile) || [];
function classifyDefect(test: any, discovery: any) {

    const errors = discovery?.consoleErrors || [];
    const network = discovery?.networkFailures || [];

    // NETWORK ISSUES
    if (network.length > 0) {
        return {
            type: "NETWORK_FAILURE",
            severity: "HIGH",
            rootCause: "One or more HTTP requests failed",
            evidence: network
        };
    }

    // JS / Console Errors
    if (errors.length > 0) {
        return {
            type: "JS_ERROR",
            severity: "HIGH",
            rootCause: "JavaScript runtime errors detected",
            evidence: errors
        };
    }

    // UI STRUCTURE ISSUES
    if (test.test?.includes("interactive") && test.status === "FAILED") {
        return {
            type: "UI_MISSING_ELEMENTS",
            severity: "MEDIUM",
            rootCause: "No interactive elements detected on page",
            evidence: null
        };
    }

    // PERFORMANCE ISSUES
    if (test.test?.includes("performance")) {
        return {
            type: "PERFORMANCE_DEGRADATION",
            severity: "MEDIUM",
            rootCause: "Page load or reload took longer than expected",
            evidence: null
        };
    }

    // DEFAULT
    return {
        type: "UNKNOWN",
        severity: "LOW",
        rootCause: "Unable to determine exact failure cause",
        evidence: null
    };
}
const defects: any[] = [];

for (const test of qaResults) {

    if (test.status === "PASSED") continue;

    const defect = classifyDefect(test, discovery);

    defects.push({
        test: test.test,
        status: test.status,
        ...defect
    });
}
const finalReport = {
    executionTime: new Date().toISOString(),
    summary: {
        total: qaResults.length,
        passed: qaResults.filter(t => t.status === "PASSED").length,
        failed: qaResults.filter(t => t.status !== "PASSED").length,
        defects: defects.length
    },
    defects
};

fs.writeFileSync(
    `${resultsPath}/final-report.json`,
    JSON.stringify(finalReport, null, 2)
);

console.log("Defect Analysis Completed");
console.log(JSON.stringify(finalReport, null, 2));
