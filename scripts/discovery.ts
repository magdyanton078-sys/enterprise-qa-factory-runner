
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
    };

    forms: any[];

    buttons: any[];

    inputs: any[];

    links: any[];

    images: any[];

    navigation: any[];

    consoleErrors: string[];

    networkFailures: any[];

    technologies: string[];

    accessibility: any;

    performance: any;

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
      const buttons =
        await page.locator("button,[role='button']").count();

    const links =
        await page.locator("a").count();

    const inputs =
        await page.locator("input").count();

    const textareas =
        await page.locator("textarea").count();

    const dropdowns =
        await page.locator("select").count();

    const checkboxes =
        await page.locator("input[type=checkbox]").count();

    const radios =
        await page.locator("input[type=radio]").count();

    const images =
        await page.locator("img").count();

    const forms =
        await page.locator("form").count();

    const tables =
        await page.locator("table").count();

    const headings =
        await page.locator("h1,h2,h3,h4,h5,h6").count();

    const formData = await page.locator("form").evaluateAll(forms =>

        forms.map((f: any) => ({

            id: f.id,

            name: f.name,

            action: f.action,

            method: f.method,

            inputs: f.querySelectorAll("input").length,

            buttons: f.querySelectorAll("button").length

        }))

    );
    const buttonData =
        await page.locator("button,[role='button']").evaluateAll(btns =>

            btns.map((b: any) => ({

                text: b.innerText,

                id: b.id,

                type: b.type,

                disabled: b.disabled

            }))

        );
      const inputData =
        await page.locator("input").evaluateAll(inputs =>

            inputs.map((i: any) => ({

                type: i.type,

                id: i.id,

                name: i.name,

                placeholder: i.placeholder,

                required: i.required

            }))

        );
      const linkData =
        await page.locator("a").evaluateAll(links =>

            links.map((l: any) => ({

                text: l.innerText,

                href: l.href

            }))

        );
      const imageData =
        await page.locator("img").evaluateAll(imgs =>

            imgs.map((img: any) => ({

                src: img.src,

                alt: img.alt

            }))

        );
      const navigation =
        await page.locator("nav a").evaluateAll(items =>

            items.map((n: any) => ({

                text: n.innerText,

                href: n.href

            }))

        );
      const performance = await page.evaluate(() => {

        const nav =
            performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

        return {

            domContentLoaded:
                nav.domContentLoadedEventEnd,

            loadEvent:
                nav.loadEventEnd,

            transferSize:
                nav.transferSize

        };

    });
      const accessibility = {

        imagesWithoutAlt:
            await page.locator("img:not([alt])").count(),

        buttonsWithoutText:
            await page.locator("button:empty").count(),

        inputsWithoutLabel:
            await page.locator("input:not([aria-label])").count()

    };
      return {

        executionTime: new Date().toISOString(),

        url: page.url(),

        title: await page.title(),

        viewport: page.viewportSize()!,

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

            headings

        },

        forms: formData,

        buttons: buttonData,

        inputs: inputData,

        links: linkData,

        images: imageData,

        navigation,

        consoleErrors,

        networkFailures,

        technologies: [],

        accessibility,

        performance

    };

}
