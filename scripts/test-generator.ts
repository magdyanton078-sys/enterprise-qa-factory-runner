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

/**
 * Load discovery safely
 */
function loadDiscovery(): DiscoveryResult {
    const path = "test-results/discovery.json";

    if (!fs.existsSync(path)) {
        throw new Error("Missing discovery.json - run discovery step first");
    }

    return JSON.parse(fs.readFileSync(path, "utf8"));
}

/**
 * Generate tests
 */
export function generateTests(discovery: DiscoveryResult): GeneratedTest[] {

    const tests: GeneratedTest[] = [];

    // ---------------- FORMS ----------------
    if (discovery.forms?.length) {
        tests.push(
            {
                id: "FORM-001",
                feature: "Forms",
                title: "Submit Valid Form",
                type: "Positive",
                priority: "Critical",
                description: "Submit form with valid values",
                expected: "Form submitted successfully"
            },
            {
                id: "FORM-002",
                feature: "Forms",
                title: "Required Fields",
                type: "Negative",
                priority: "Critical",
                description: "Leave required fields empty",
                expected: "Validation appears"
            }
        );
    }

    // ---------------- INPUTS ----------------
    if (discovery.inputs?.length) {
        tests.push({
            id: "INPUT-001",
            feature: "Input",
            title: "Accept Valid Input",
            type: "Positive",
            priority: "High",
            description: "Type valid input",
            expected: "Accepted"
        });
    }

    // ---------------- BUTTONS ----------------
    if (discovery.buttons?.length) {
        tests.push({
            id: "BTN-001",
            feature: "Buttons",
            title: "Buttons Clickable",
            type: "Functional",
            priority: "Critical",
            description: "Verify button interaction",
            expected: "Action executed"
        });
    }

    // ---------------- NAVIGATION ----------------
    if (discovery.navigation?.length) {
        tests.push({
            id: "NAV-001",
            feature: "Navigation",
            title: "Navigation Works",
            type: "Functional",
            priority: "Critical",
            description: "Verify navigation links",
            expected: "Page loads"
        });
    }

    // ---------------- LINKS ----------------
    if (discovery.links?.length) {
        tests.push({
            id: "LINK-001",
            feature: "Links",
            title: "Links Valid",
            type: "Functional",
            priority: "Medium",
            description: "Check link responses",
            expected: "HTTP 200"
        });
    }

    return tests;
}

/**
 * MAIN
 */
function main() {

    const discovery = loadDiscovery();

    const tests = generateTests(discovery);

    fs.mkdirSync("test-results", { recursive: true });

    fs.writeFileSync(
        "test-results/generated-tests.json",
        JSON.stringify(tests, null, 2)
    );

    console.log(`Generated ${tests.length} test cases`);
}

main();
