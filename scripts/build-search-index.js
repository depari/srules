const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const rulesDir = path.join(__dirname, '../rules');
const outputPath = path.join(__dirname, '../public/search-index.json');

function getAllRules(dir) {
    let rules = [];

    // rules 디렉토리가 없으면 빈 인덱스 생성
    if (!fs.existsSync(dir)) {
        console.log('⚠️  Rules directory not found. Creating empty search index.');
        return rules;
    }

    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            rules = rules.concat(getAllRules(filePath));
        } else if (file.endsWith('.md')) {
            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                const { data, content: body } = matter(content);

                // slug 생성 (frontmatter에 있으면 사용, 없으면 파일 경로로 생성)
                const relativePath = path.relative(rulesDir, filePath);
                const slug = data.slug || relativePath.replace(/\.md$/, '').replace(/\\/g, '/');

                // 발췌문 생성
                const excerpt = body
                    .substring(0, 200)
                    .replace(/\n/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();

                rules.push({
                    title: data.title || 'Untitled',
                    slug,
                    category: data.category || [],
                    tags: data.tags || [],
                    author: data.author || 'Anonymous',
                    excerpt: excerpt || '',
                    path: slug,
                    difficulty: data.difficulty,
                    created: data.created,
                });
            } catch (error) {
                console.error(`❌ Error processing ${filePath}:`, error.message);
            }
        }
    }

    return rules;
}

try {
    const searchIndex = getAllRules(rulesDir);

    // public 디렉토리 확인 및 생성
    const publicDir = path.dirname(outputPath);
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(
        outputPath,
        JSON.stringify(searchIndex, null, 2),
        'utf-8'
    );

    console.log(`✅ Search index created: ${searchIndex.length} rules`);
    console.log(`📝 Output: ${outputPath}`);
} catch (error) {
    console.error('❌ Failed to build search index:', error);
    process.exit(1);
}
