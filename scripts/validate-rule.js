const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const rulesDir = path.join(__dirname, '../rules');

function validateFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data, content: body } = matter(content);
    const errors = [];

    // 1. Frontmatter 필수 필드 검사
    const requiredFields = ['title', 'slug', 'version', 'created', 'tags', 'category', 'difficulty'];
    for (const field of requiredFields) {
        if (!data[field]) {
            errors.push(`Missing required field: ${field}`);
        }
    }

    // 2. 제목 길이 검사
    if (data.title && (data.title.length < 5 || data.title.length > 100)) {
        errors.push(`Title length must be between 5 and 100 chars (Current: ${data.title.length})`);
    }

    // 3. 본문 길이 검사
    if (body.trim().length < 50) {
        errors.push('Content must be at least 50 characters long.');
    }

    // 4. 필수 섹션 검사 (개요, 예시)
    if (!body.includes('## 개요')) {
        errors.push('Missing required section: ## 개요');
    }
    if (!body.includes('## 예시')) {
        errors.push('Missing required section: ## 예시');
    }

    return errors;
}

function getAllMarkdownFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllMarkdownFiles(file));
        } else if (file.endsWith('.md')) {
            results.push(file);
        }
    });
    return results;
}

const files = getAllMarkdownFiles(rulesDir);
let totalErrors = 0;

console.log(`🔍 Validating ${files.length} rule files...`);

files.forEach(file => {
    const relativePath = path.relative(rulesDir, file);
    const errors = validateFile(file);
    if (errors.length > 0) {
        console.error(`❌ [${relativePath}]`);
        errors.forEach(err => console.error(`   - ${err}`));
        totalErrors += errors.length;
    }
});

if (totalErrors > 0) {
    console.error(`\n🚨 Validation failed with ${totalErrors} errors.`);
    process.exit(1);
} else {
    console.log('\n✅ All rules passed validation!');
    process.exit(0);
}
