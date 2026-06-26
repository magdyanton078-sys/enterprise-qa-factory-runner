
import fs from "fs";

const generatedDir = "generated-tests";

if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
}

const testCases = JSON.parse(
    fs.readFileSync("test-results/test-cases.json", "utf8")
);

let output = `
import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL!;

`;

for (const tc of testCases) {

    output += `

test('${tc.id} - ${tc.title}', async ({ page }) => {

    await page.goto(TARGET_URL, {
        waitUntil: 'networkidle',
        timeout: 60000
    });

`;

    switch (tc.type) {

        case "Smoke":

            output += `
    await expect(page).toHaveTitle(/.+/);
`;
            break;

        case "Navigation":

            output += `
    const links = page.locator('a');
    expect(await links.count()).toBeGreaterThan(0);
`;
            break;

        case "Forms":

            output += `
    const inputs = page.locator('input,textarea');
    expect(await inputs.count()).toBeGreaterThan(0);
`;
            break;

        case "Buttons":

            output += `
    const buttons = page.locator('button,[role="button"]');
    expect(await buttons.count()).toBeGreaterThan(0);
`;
            break;

        case "Accessibility":

            output += `
    const images = page.locator('img');
    const count = await images.count();

    for(let i=0;i<count;i++){
        const alt = await images.nth(i).getAttribute('alt');
        expect(alt).not.toBeNull();
    }
`;
            break;

        case "Performance":

            output += `
    const start = Date.now();

    await page.reload({
        waitUntil:'networkidle'
    });

    const duration = Date.now() - start;

    expect(duration).toBeLessThan(10000);
`;
            break;

        case "SEO":

            output += `
    const description = page.locator('meta[name="description"]');
    expect(await description.count()).toBeGreaterThan(0);
`;
            break;

        case "Responsive":

            output += `
    await page.setViewportSize({
        width:375,
        height:812
    });

    await page.reload();

    await expect(page.locator("body")).toBeVisible();
`;
            break;

        case "Images":

            output += `
    const imgs = page.locator("img");
    expect(await imgs.count()).toBeGreaterThan(0);
`;
            break;

        case "Console":

            output += `
    const errors:string[]=[];

    page.on("console",msg=>{
        if(msg.type()=="error"){
            errors.push(msg.text());
        }
    });

    await page.reload();

    expect(errors.length).toBeLessThan(5);
`;
            break;

        default:

            output += `
    await expect(page.locator("body")).toBeVisible();
`;
    }

    output += `
});
`;
}

fs.writeFileSync(
    "generated-tests/generated.spec.ts",
    output
);

console.log(
    "Generated",
    testCases.length,
    "Playwright tests."
);
