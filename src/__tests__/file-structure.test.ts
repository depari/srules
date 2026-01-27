import fs from 'fs';
import path from 'path';

describe('Public File Structure', () => {
    const publicRulesDir = path.join(process.cwd(), 'public/rules');

    it('should have public/rules directory populated', () => {
        expect(fs.existsSync(publicRulesDir)).toBe(true);

        const files = fs.readdirSync(publicRulesDir, { recursive: true });
        const mdFiles = files.filter((f: any) => typeof f === 'string' && f.endsWith('.md'));

        expect(mdFiles.length).toBeGreaterThan(0);

        // Check for a specific known file
        // Note: fs.readdirSync with recursive: true returns relative paths from dir, e.g., 'git/commit-messages.md' or buffer in older node (but we are in node 20 environment hopefully where it returns strings or buffer)
        // Actually, recursive option for readdirSync depends on Node version. Let's assume standard behavior or just check specific existence.
    });

    it('should verify git/commit-messages.md exists in public', () => {
        const targetFile = path.join(publicRulesDir, 'git/commit-messages.md');
        expect(fs.existsSync(targetFile)).toBe(true);
    });
});
