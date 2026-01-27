const fs = require('fs');
const path = require('path');

const filesToCheck = [
    'src/components/rules/RuleActions.tsx',
    'src/components/common/Header.tsx',
    'src/components/common/ThemeToggle.tsx',
    'src/components/rules/ReadingProgress.tsx'
];

let failed = false;

filesToCheck.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${file}`);
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.trim().startsWith("'use client'") && !content.trim().startsWith('"use client"')) {
        console.error(`[FAIL] ${file} is missing "use client" directive.`);
        failed = true;
    } else {
        console.log(`[PASS] ${file} has "use client" directive.`);
    }
});

if (failed) {
    process.exit(1);
} else {
    console.log('All client component checks passed.');
}
