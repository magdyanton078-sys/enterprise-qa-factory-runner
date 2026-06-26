import fs from "fs";

const generatedDir = "generated-tests";
const inputFile = "test-results/generated-tests.json";

if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
}

if (!fs.existsSync(inputFile)) {
    throw new Error("generated-tests.json not found");
}

const testCases = JSON.parse(
    fs.readFileSync(inputFile, "utf8")
);

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

for (const tc of testCases) {

    const id = sanitize(safe(tc.id, "TEST"));

    const title = safe(tc.title, "Generated Test");

    const type = safe(tc.type).toLowerCase();

    output += `

test("${id} - ${title}", async ({ page }) => {

    await page.waitForLoadState("domcontentloaded");

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

        output += `
    const inputs = page.locator("input, textarea, select");

    expect(await inputs.count()).toBeGreaterThan(0);
`;

    }

    else if (type.includes("button")) {

        output += `
    const buttons = page.locator("button,[role='button']");

    expect(await buttons.count()).toBeGreaterThan(0);
`;

    }

    else if (type.includes("navigation")) {

        output += `
    const links = page.locator("a");

    expect(await links.count()).toBeGreaterThan(0);
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

        output += `
    const imgs = page.locator("img");

    expect(await imgs.count()).toBeGreaterThan(0);
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
console.log(`Test Cases : ${testCases.length}`);
console.log(`Output File: ${generatedDir}/generated.spec.ts`);
console.log("====================================");
