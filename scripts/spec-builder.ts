import fs from "fs";

const generatedDir = "generated-tests";
const inputFile = "test-results/generated-tests.json";

if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
}

if (!fs.existsSync(inputFile)) {
    throw new Error("generated-tests.json not found");
}

const allTests = JSON.parse(
    fs.readFileSync(inputFile, "utf8")
);

const CI_ONLY = process.env.CI === "true";

const PRIORITY_ORDER = {
    Critical: 1,
    High: 2,
    Medium: 3
};

const testCases = CI_ONLY
    ? allTests
        .sort(
            (a: any, b: any) =>
                PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER] -
                PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER]
        )
        .filter(
            (t: any) =>
                t.priority === "Critical" ||
                t.priority === "High"
        )
    : allTests;
let output = `
import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL!;

test.beforeEach(async ({ page }) => {

    await page.goto(TARGET_URL, {

        waitUntil: "domcontentloaded",

        timeout: 60000

    });

});

`;

function safe(value: any, fallback = "") {

    if (typeof value !== "string")
        return fallback;

    return value.trim() || fallback;

}

function sanitize(value: string) {

    return value.replace(/[^a-zA-Z0-9-_]/g, "_");

}
function escapeSelector(value: string) {
    return value.replace(/'/g, "\\'"); 
    }

for (const tc of testCases) {

    const id = sanitize(safe(tc.id, "TEST"));

    const title = safe(tc.title, "Generated Test");
    const type = safe(tc.type).toLowerCase();



    const selector = escapeSelector(safe(tc.selector));

    output += `

test("${id} - ${title}", async ({ page }) => {

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);

`; 
        // =====================================================
    // SMART ASSERTIONS
    // =====================================================

    if (type.includes("smoke")) {

        output += `
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator("body")).toBeVisible();
`;

    }

    else if (type.includes("form")) {
    const formLocator =
    selector || "form";

        output += `
   const form = page.locator(${JSON.stringify(formLocator)}).first();

await expect(form).toBeVisible();

const inputs = form.locator("input, textarea, select");

expect(await inputs.count()).toBeGreaterThan(0);
`;

    }

else if (type.includes("button")) {

    const buttonLocator =
        selector || "button";

    output += `
const btn = page.locator(${JSON.stringify(buttonLocator)}).first();

await page.waitForTimeout(2000);

const count = await btn.count();

if (count > 0) {

    if (await btn.first().isVisible()) {

        await expect(btn.first()).toBeEnabled();

    }

}

if (await btn.isVisible()) {
    await expect(btn).toBeEnabled();
}
`;
}

else if (type.includes("navigation")) {
    const navLocator = selector
    ? `a[href="${selector}"]`
    : "a";

output += `
const nav = page.locator(${JSON.stringify(navLocator)});

await expect(nav.first()).toBeVisible();
`;

}

    else if (type.includes("access")) {

        output += `
    const images = page.locator("img");

    const count = await images.count();

    for (let i = 0; i < count; i++) {

        const alt = await images.nth(i).getAttribute("alt");

        expect(alt).not.toBeNull();

    }
`;

    }

    else if (type.includes("performance")) {

        output += `
    const start = Date.now();

    await page.reload({

        waitUntil: "domcontentloaded"

    });

    const duration = Date.now() - start;

    expect(duration).toBeLessThan(10000);
`;

    }

    else if (type.includes("seo")) {

        output += `
    const meta = page.locator("meta[name='description']");

    expect(await meta.count()).toBeGreaterThan(0);
`;

    }

    else if (type.includes("responsive")) {

        output += `
    await page.setViewportSize({

        width: 375,

        height: 812

    });

    await page.reload();

    await expect(page.locator("body")).toBeVisible();
`;

    }

    else if (type.includes("image")) {
        const imgLocator = selector
    ? `img[src="${selector}"]`
    : "img";

output += `
const img = page.locator(${JSON.stringify(imgLocator)});

await expect(img.first()).toBeVisible();
`;
    }

    else {

        output += `
    await expect(page.locator("body")).toBeVisible();
`;

    }

    output += `

});

`;
} 
fs.writeFileSync(
    `${generatedDir}/generated.spec.ts`,
    output,
    "utf8"
);

console.log("");
console.log("====================================");
console.log("Playwright Spec Generated");
console.log("====================================");
console.log(`Generated Specs : ${testCases.length}`);
console.log(`Available Tests : ${allTests.length}`);
console.log(`Output File: ${generatedDir}/generated.spec.ts`);
console.log("====================================");
