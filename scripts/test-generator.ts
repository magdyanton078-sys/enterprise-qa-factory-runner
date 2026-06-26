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
 * Load discovery result from file (IMPORTANT FIX)
 */
function loadDiscovery(): DiscoveryResult {
    return JSON.parse(
        fs.readFileSync("test-results/discovery.json", "utf8")
    );
}

/**
 * Generate tests based on discovery
 */
export function generateTests(discovery: DiscoveryResult): GeneratedTest[] {

    const tests: GeneratedTest[] = [];

    // ---------------------------
    // FORMS
    // ---------------------------
    if (discovery.forms?.length > 0) {

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
            },
            {
                id: "FORM-003",
                feature: "Forms",
                title: "Boundary Input",
                type: "Boundary",
                priority: "High",
                description: "Maximum length validation",
                expected: "Handled correctly"
            }
        );
    }

    // ---------------------------
    // INPUTS
    // ---------------------------
    if (discovery.inputs?.length > 0) {

        tests.push(
            {
                id: "INPUT-001",
                feature: "Input",
                title: "Accept Valid Input",
                type: "Positive",
                priority: "High",
                description: "Type valid value",
                expected: "Accepted"
            },
            {
                id: "INPUT-002",
                feature: "Input",
                title: "Reject Invalid Characters",
                type: "Negative",
                priority: "High",
                description: "Enter special characters",
                expected: "Validation triggered"
            }
        );
    }

    // ---------------------------
    // BUTTONS
    // ---------------------------
    if (discovery.buttons?.length > 0) {

        tests.push({
            id: "BTN-001",
            feature: "Buttons",
            title: "Clickable Buttons",
            type: "Functional",
            priority: "Critical",
            description: "Verify buttons are clickable",
            expected: "Action executed"
        });
    }

    // ---------------------------
    // NAVIGATION
    // ---------------------------
    if (discovery.navigation?.length > 0) {

        tests.push({
            id: "NAV-001",
            feature: "Navigation",
            title: "Navigation Links",
            type: "Functional",
            priority: "Critical",
            description: "Verify navigation works",
            expected: "Page loads correctly"
        });
    }

    // ---------------------------
    // LINKS
    // ---------------------------
    if (discovery.links?.length > 0) {

        tests.push({
            id: "LINK-001",
            feature: "Links",
            title: "Check Links",
            type: "Functional",
            priority: "Medium",
            description: "Validate link responses",
            expected: "HTTP 200 OK"
        });
    }

    return tests;
}

/**
 * MAIN EXECUTION (IMPORTANT FIX)
 */
function main() {

    const discovery = loadDiscovery();

    const tests = generateTests(discovery);

    fs.writeFileSync(
        "test-results/generated-tests.json",
        JSON.stringify(tests, null, 2)
    );

    console.log(`Generated ${tests.length} test cases`);
}

// Run script
main();
