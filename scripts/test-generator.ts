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

    if (discovery.forms.length) {

        tests.push(
            {
                id: "FORM-001",
                feature: "Forms",
                title: "Submit Valid Form",
                type: "Form",
                priority: "Critical",
                description: "Submit form with valid values",
                expected: "Form submitted successfully"
            },
            {
                id: "FORM-002",
                feature: "Forms",
                title: "Required Fields",
                type: "Form",
                priority: "Critical",
                description: "Leave required fields empty",
                expected: "Validation appears"
            }
        );

    }

    if (discovery.inputs.length) {

        tests.push({

            id: "INPUT-001",

            feature: "Inputs",

            title: "Accept Valid Input",

            type: "Form",

            priority: "High",

            description: "Verify typing",

            expected: "Input accepted"

        });

    }

    if (discovery.buttons.length) {

        tests.push({

            id: "BTN-001",

            feature: "Buttons",

            title: "Buttons Clickable",

            type: "Button",

            priority: "Critical",

            description: "Verify button click",

            expected: "Button works"

        });

    }

    if (discovery.navigation.length) {

        tests.push({

            id: "NAV-001",

            feature: "Navigation",

            title: "Navigation Links",

            type: "Navigation",

            priority: "Critical",

            description: "Verify navigation",

            expected: "Navigation successful"

        });

    }

    if (discovery.links.length) {

        tests.push({

            id: "LINK-001",

            feature: "Links",

            title: "Links Exist",

            type: "Navigation",

            priority: "Medium",

            description: "Verify links",

            expected: "Links available"

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

        "test-results/test-cases.json",

        JSON.stringify(tests, null, 2)

    );

    console.log("");

    console.log("Generated", tests.length, "test cases.");

    console.log("Output : test-results/test-cases.json");

}

main();
