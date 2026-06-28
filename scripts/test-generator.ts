import fs from "fs";

export interface GeneratedTest {
    id: string;
    feature: string;
    title: string;
    type: string;
    priority: string;
    description: string;
    expected: string;
    selector?: string;
}

export interface DiscoveryResult {
    statistics: any;

    forms: any[];

    buttons: any[];

    inputs: any[];

    navigation: any[];

    links: any[];

    images?: any[];

    metaTags?: any[];

    accessibility?: any;

    performance?: any;

    security?: any;
   
    tables?: any[];

    dropdowns?: any[];

    checkboxes?: any[];

    radios?: any[];

   iframes?: any[];
}

function loadDiscovery(): DiscoveryResult {

    const path = "test-results/discovery.json";

    if (!fs.existsSync(path)) {
        throw new Error("Discovery file not found.");
    }

    return JSON.parse(fs.readFileSync(path, "utf8"));

}

export function generateTests(discovery: DiscoveryResult): GeneratedTest[] {

    const tests: GeneratedTest[] = [];
    
if (discovery.statistics?.forms > 0 && discovery.forms?.length) {

    discovery.forms.forEach((form, index) => {

    tests.push({

        id: `FORM-${100 + index}`,

        feature: "Forms",

        title: `Validate Form ${index + 1}`,

        type: "Form",

        priority: "Critical",

        description: `Validate discovered form ${index + 1}`,

        expected: "Form behaves correctly",

       
selector:
    form.id
        ? `#${form.id}`
        : form.name
            ? `form[name="${form.name}"]`
            : `form:nth-of-type(${index + 1})`
    });
    });
    }
    
   if (discovery.statistics?.inputs > 0 && discovery.inputs?.length) {

    discovery.inputs.forEach((input, index) => {

    tests.push({

        id: `INPUT-${100 + index}`,

        feature: "Inputs",

        title: `Validate Input ${index + 1}`,

        type: "Form",

        priority: "High",

        description: `Verify input ${input.name || input.id || index}`,

        expected: "Input accepts valid values",

     selector:
    input.id
    || input.name
    || input.placeholder
    || `input:nth-of-type(${index + 1})`

    });

});
       }
       

if (discovery.statistics?.buttons > 0 && discovery.buttons?.length) {

    discovery.buttons.forEach((button, index) => {

    tests.push({

        id: `BTN-${100 + index}`,

        feature: "Buttons",

        title: `Button ${index + 1} Click`,

        type: "Button",

        priority: "Critical",

        description: button.text || "Verify button",

        expected: "Button clickable",

selector =
button.id
|| button.name
|| button.testId
|| button.dataTestId
|| `button:nth-of-type(${index + 1})`

    });

});
    }
if (discovery.statistics?.navigation > 0 && discovery.navigation?.length) {

    discovery.navigation.forEach((nav, index) => {

    tests.push({

        id: `NAV-${100 + index}`,

        feature: "Navigation",

        title: `Navigation ${index + 1}`,

        type: "Navigation",

        priority: "Critical",

        description: nav.text,

        expected: "Navigation works",

selector:
    nav.href
        ? `a[href="${nav.href}"]`
        : `nav >> nth=${index}`

    });

});
}
    
if (discovery.statistics?.links > 0 && discovery.links?.length) {
   discovery.links.forEach((link, index) => {

    tests.push({

        id: `LINK-${100 + index}`,

        feature: "Links",

        title: `Verify Link ${index + 1}`,

        type: "Navigation",

        priority: "Medium",

        description: link.href,

        expected: "Link reachable",

        
selector:
    link.href
        ? `a[href="${link.href}"]`
        : `a:nth-of-type(${index + 1})`

    });

});
}

 if (discovery.statistics?.images > 0 && discovery.images?.length) {

    discovery.images.forEach((img, index) => {

        tests.push({

            id: `IMG-${100 + index}`,

            feature: "Images",

            title: `Image ${index + 1}`,

            type: "Image",

            priority: "Medium",

            description: img.alt || img.src,

            expected: "Image loads",
selector:
img.id
    ? `#${img.id}`
    : img.alt
        ? `img[alt="${img.alt}"]`
        : `img:nth-of-type(${index + 1})`

    });
    });

}
    if (discovery.metaTags?.length) {

    tests.push({

        id: "SEO-001",

        feature: "SEO",

        title: "Meta Tags",

        type: "SEO",

        priority: "Medium",

        description: "Verify meta tags",

        expected: "Meta tags exist"

    });

}
if (discovery.accessibility != null) {

    tests.push({

        id: "ACCESS-001",

        feature: "Accessibility",

        title: "Accessibility Validation",

        type: "Accessibility",

        priority: "High",

        description: "Validate accessibility",

        expected: "Accessibility requirements met"

    });

}

if (discovery.performance != null) {
    

    tests.push({

        id: "PERF-001",

        feature: "Performance",

        title: "Performance Validation",

        type: "Performance",

        priority: "Medium",

        description: "Measure loading performance",

        expected: "Performance acceptable"

    });

}
 if (discovery.security != null) {

    tests.push({

        id: "SEC-001",

        feature: "Security",

        title: "HTTPS Validation",

        type: "Security",

        priority: "Critical",

        description: "Verify HTTPS",

        expected: "HTTPS enabled"

    });

}
    if (discovery.tables?.length) {

    discovery.tables.forEach((table, index) => {

        tests.push({

            id: `TABLE-${100 + index}`,

            feature: "Tables",

            title: `Validate Table ${index + 1}`,

            type: "Table",

            priority: "Medium",

            description: "Validate discovered table",

            expected: "Table rendered",
selector:
table.id
|| `table:nth-of-type(${index + 1})`

        });

    });

}
    if (discovery.dropdowns?.length) {

    discovery.dropdowns.forEach((item, index) => {

        tests.push({

            id: `SELECT-${100 + index}`,

            feature: "Dropdown",

            title: `Dropdown ${index + 1}`,

            type: "Dropdown",

            priority: "Medium",

            description: "Validate dropdown",

            expected: "Dropdown selectable",
selector:
item.id
|| item.name
|| `select:nth-of-type(${index + 1})`

        });

    });

}
    if (discovery.checkboxes?.length) {

    discovery.checkboxes.forEach((item, index) => {

        tests.push({

            id: `CHECK-${100 + index}`,

            feature: "Checkbox",

            title: `Checkbox ${index + 1}`,

            type: "Checkbox",

            priority: "Medium",

            description: "Validate checkbox",

            expected: "Checkbox works",
 selector:
item.id
|| item.name
|| `input[type="checkbox"]:nth-of-type(${index + 1})`
        });

    });

}
    if (discovery.radios?.length) {

    discovery.radios.forEach((item, index) => {

        tests.push({

            id: `RADIO-${100 + index}`,

            feature: "Radio",

            title: `Radio ${index + 1}`,

            type: "Radio",

            priority: "Medium",

            description: "Validate radio button",

            expected: "Radio selectable",

selector:
item.id
|| item.name
|| `input[type="radio"]:nth-of-type(${index + 1})`

        });

    });

}
    if (discovery.iframes?.length) {

    discovery.iframes.forEach((item, index) => {

        tests.push({

            id: `IFRAME-${100 + index}`,

            feature: "Iframe",

            title: `Iframe ${index + 1}`,

            type: "Iframe",

            priority: "Medium",

            description: "Validate iframe",

            expected: "Iframe loads",
selector:
item.id
    ? `#${item.id}`
    : item.name
        ? `iframe[name="${item.name}"]`
        : `iframe:nth-of-type(${index + 1})`

        });

    });

}
    
    

    // Always generate at least one smoke test
    tests.push({

        id: "SMOKE-001",

        feature: "Smoke",

        title: "Homepage Loads",

        type: "Smoke",

        priority: "Critical",

        description: "Verify homepage loads",

        expected: "Homepage displayed"

    });

    return tests;

}

function main() {

    const discovery = loadDiscovery();

    const tests = generateTests(discovery);

    fs.mkdirSync("test-results", { recursive: true });

    fs.writeFileSync(

        "test-results/generated-tests.json",

        JSON.stringify(tests, null, 2)

    );

    console.log("");

   console.log("=================================");
console.log("Enterprise Test Generator");
console.log("=================================");
console.log("Generated Test Cases :", tests.length);
console.log("Forms                :", discovery.forms?.length || 0);
console.log("Inputs               :", discovery.inputs?.length || 0);
console.log("Buttons              :", discovery.buttons?.length || 0);
console.log("Navigation           :", discovery.navigation?.length || 0);
console.log("Links                :", discovery.links?.length || 0);
console.log("Images               :", discovery.images?.length || 0);
console.log("=================================");

    console.log("Output : test-results/generated-tests.json");

}

main();
