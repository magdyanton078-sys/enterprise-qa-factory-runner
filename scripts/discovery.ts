import { Page } from "@playwright/test";

export interface DiscoveryResult {

    executionTime: string;

    url: string;

    title: string;

    viewport: {
        width: number;
        height: number;
    };

    statistics: {

        buttons: number;

        links: number;

        inputs: number;

        textareas: number;

        dropdowns: number;

        checkboxes: number;

        radios: number;

        images: number;

        forms: number;

        tables: number;

        headings: number;

        iframes: number;

        videos: number;

        audios: number;

        scripts: number;

        stylesheets: number;
    };

    forms: any[];

    buttons: any[];

    inputs: any[];

    links: any[];

    images: any[];

    navigation: any[];

    metaTags: any[];

    cookies: any[];

    localStorage: any[];

    sessionStorage: any[];

    technologies: string[];

    consoleErrors: string[];

    networkFailures: any[];

    accessibility: {

        imagesWithoutAlt: number;

        buttonsWithoutText: number;

        inputsWithoutLabel: number;

    };

    performance: {

        domContentLoaded: number;

        loadEvent: number;

        transferSize: number;

    };

    security: {

        https: boolean;

        mixedContent: number;

    };

}
export async function discoverWebsite(page: Page): Promise<DiscoveryResult> {

    const consoleErrors: string[] = [];

    const networkFailures: any[] = [];

    page.on("console", msg => {

        if (msg.type() === "error") {

            consoleErrors.push(msg.text());

        }

    });

    page.on("response", response => {

        if (response.status() >= 400) {

            networkFailures.push({

                url: response.url(),

                status: response.status()

            });

        }

    });

    await page.waitForLoadState("networkidle");

    await page.waitForTimeout(2000);
    // ======================================================
// DOM STATISTICS
// ======================================================

const buttons =
    await page.locator("button,[role='button']").count();

const links =
    await page.locator("a").count();

const inputs =
    await page.locator("input").count();

const textareas =
    await page.locator("textarea").count();

const dropdowns =
    await page.locator("select,[role='combobox']").count();

const checkboxes =
    await page.locator("input[type='checkbox']").count();

const radios =
    await page.locator("input[type='radio']").count();

const images =
    await page.locator("img").count();

const forms =
    await page.locator("form").count();

const tables =
    await page.locator("table").count();

const headings =
    await page.locator("h1,h2,h3,h4,h5,h6").count();

const iframes =
    await page.locator("iframe").count();

const videos =
    await page.locator("video").count();

const audios =
    await page.locator("audio").count();

const scripts =
    await page.locator("script").count();

const stylesheets =
    await page.locator("link[rel='stylesheet']").count();
    // ======================================================
// PAGE METADATA
// ======================================================

const pageTitle = await page.title();

const currentUrl = page.url();

const viewport = page.viewportSize()!;
    // ======================================================
// FORMS DISCOVERY
// ======================================================

const formData = await page.locator("form").evaluateAll(forms =>

    forms.map((f: any) => ({

        id: f.id,

        name: f.name,

        action: f.action,

        method: f.method,

        enctype: f.enctype,

        autocomplete: f.autocomplete,

        inputs: f.querySelectorAll("input").length,

        buttons: f.querySelectorAll("button").length,

        selects: f.querySelectorAll("select").length,

        textareas: f.querySelectorAll("textarea").length

    }))

);
    // ======================================================
// BUTTON DISCOVERY
// ======================================================

const buttonData =
await page.locator("button,[role='button']").evaluateAll(btns =>

    btns.map((b:any)=>({

        text:b.innerText,

        id:b.id,

        type:b.type,

        disabled:b.disabled,

        className:b.className,

        ariaLabel:b.getAttribute("aria-label")

    }))

);
    // ======================================================
// INPUT DISCOVERY
// ======================================================

const inputData =
await page.locator("input").evaluateAll(inputs=>

    inputs.map((i:any)=>({

        id:i.id,

        name:i.name,

        type:i.type,

        placeholder:i.placeholder,

        value:i.value,

        required:i.required,

        disabled:i.disabled,

        readOnly:i.readOnly,

        autocomplete:i.autocomplete

    }))

);
    
