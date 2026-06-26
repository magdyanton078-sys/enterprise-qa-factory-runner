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
export async function discoverWebsite(
    page: Page
): Promise<DiscoveryResult> {

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

const formData =
await page.locator("form").evaluateAll(forms =>

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
// BUTTONS DISCOVERY
// ======================================================

const buttonData =
await page.locator("button,[role='button']").evaluateAll(btns =>

    btns.map((b:any)=>({

        text: b.innerText,

        id: b.id,

        type: b.type,

        disabled: b.disabled,

        className: b.className,

        ariaLabel: b.getAttribute("aria-label")

    }))

);
    // ======================================================
// INPUTS DISCOVERY
// ======================================================

const inputData =
await page.locator("input").evaluateAll(inputs =>

    inputs.map((i:any)=>({

        id: i.id,

        name: i.name,

        type: i.type,

        placeholder: i.placeholder,

        value: i.value,

        required: i.required,

        disabled: i.disabled,

        readOnly: i.readOnly,

        autocomplete: i.autocomplete

    }))

);
    // ======================================================
// LINKS DISCOVERY
// ======================================================

const linkData =
await page.locator("a").evaluateAll(links =>

    links.map((l:any)=>({

        text: l.innerText,

        href: l.href,

        target: l.target,

        rel: l.rel

    }))

);
    // ======================================================
// IMAGES DISCOVERY
// ======================================================

const imageData =
await page.locator("img").evaluateAll(images =>

    images.map((img:any)=>({

        src: img.src,

        alt: img.alt,

        width: img.width,

        height: img.height

    }))

);
    // ======================================================
// NAVIGATION DISCOVERY
// ======================================================

const navigation =
await page.locator("nav a").evaluateAll(items =>

    items.map((n:any)=>({

        text: n.innerText,

        href: n.href

    }))

);
    // ======================================================
// META TAGS
// ======================================================

const metaTags =
await page.locator("meta").evaluateAll(meta =>

    meta.map((m:any)=>({

        name: m.getAttribute("name"),

        property: m.getAttribute("property"),

        content: m.getAttribute("content")

    }))

);
    // ======================================================
// COOKIES
// ======================================================

const cookies = await page.context().cookies();
    // ======================================================
// LOCAL STORAGE
// ======================================================

const localStorageData = await page.evaluate(() => {

    const result: any[] = [];

    for (let i = 0; i < localStorage.length; i++) {

        const key = localStorage.key(i);

        result.push({

            key,

            value: key ? localStorage.getItem(key) : null

        });

    }

    return result;

});
    // ======================================================
// SESSION STORAGE
// ======================================================

const sessionStorageData = await page.evaluate(() => {

    const result: any[] = [];

    for (let i = 0; i < sessionStorage.length; i++) {

        const key = sessionStorage.key(i);

        result.push({

            key,

            value: key ? sessionStorage.getItem(key) : null

        });

    }

    return result;

});
    // ======================================================
// PERFORMANCE
// ======================================================

const performanceData = await page.evaluate(() => {

    const perf: any = globalThis.performance;
    const timing: any = perf.timing;

    return {

        domContentLoaded:
            timing.domContentLoadedEventEnd -
            timing.navigationStart,

        loadEvent:
            timing.loadEventEnd -
            timing.navigationStart,

        transferSize: 0

    };

});
    // ======================================================
// ACCESSIBILITY
// ======================================================

const accessibility = {

    imagesWithoutAlt:

        await page.locator("img:not([alt])").count(),

    buttonsWithoutText:

        await page.locator("button:empty").count(),

    inputsWithoutLabel:

        await page.locator("input:not([aria-label])").count()

};
    // ======================================================
// SECURITY
// ======================================================

const security = {

    https: currentUrl.startsWith("https://"),

    mixedContent: 0

};
    // ======================================================
// TECHNOLOGIES
// ======================================================

const technologies: string[] = [];
    // ======================================================
// FINAL RESULT
// ======================================================

return {

    executionTime: new Date().toISOString(),

    url: currentUrl,

    title: pageTitle,

    viewport,

    statistics: {

        buttons,

        links,

        inputs,

        textareas,

        dropdowns,

        checkboxes,

        radios,

        images,

        forms,

        tables,

        headings,

        iframes,

        videos,

        audios,

        scripts,

        stylesheets

    },

    forms: formData,

    buttons: buttonData,

    inputs: inputData,

    links: linkData,

    images: imageData,

    navigation,

    metaTags,

    cookies,

    localStorage: localStorageData,

    sessionStorage: sessionStorageData,

    technologies,

    consoleErrors,

    networkFailures,

    accessibility,

    performance,

    security

};

}
