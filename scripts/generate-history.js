const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rulesDir = path.join(__dirname, '../rules');
const outputPath = path.join(__dirname, '../public/rule-history.json');

function getGitHistory(filePath) {
    try {
        // git log 명령어로 해당 파일의 커밋 히스토리 추출
        // %H: commit hash, %an: author name, %ad: author date, %s: subject
        const log = execSync(
            `git log --follow --pretty=format:"%H|%an|%ad|%s" --date=short -- "${filePath}"`,
            { encoding: 'utf-8' }
        );

        if (!log) return [];

        return log.split('\n').map(line => {
            const [hash, author, date, message] = line.split('|');
            return { hash, author, date, message };
        });
    } catch (error) {
        console.error(`⚠️  Failed to get git history for ${filePath}:`, error.message);
        return [];
    }
}

function getAllRules(dir) {
    let results = {};
    const list = fs.readdirSync(dir);

    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            Object.assign(results, getAllRules(filePath));
        } else if (file.endsWith('.md')) {
            const relativePath = path.relative(rulesDir, filePath).replace(/\\/g, '/');
            const slug = relativePath.replace(/\.md$/, '');

            console.log(`📜 Processing history for: ${slug}`);
            results[slug] = getGitHistory(filePath);
        }
    });

    return results;
}

try {
    console.log('🔍 Starting version history generation...');

    if (!fs.existsSync(rulesDir)) {
        console.log('❌ Rules directory not found.');
        process.exit(1);
    }

    const historyData = getAllRules(rulesDir);

    // public 디렉토리 확인
    const publicDir = path.dirname(outputPath);
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(
        outputPath,
        JSON.stringify(historyData, null, 2),
        'utf-8'
    );

    console.log(`✅ Version history generated for ${Object.keys(historyData).length} rules.`);
    console.log(`📝 Output: ${outputPath}`);
} catch (error) {
    console.error('❌ Failed to generate version history:', error);
    process.exit(1);
}
