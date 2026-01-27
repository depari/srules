import { marked, Renderer } from 'marked';
import hljs from 'highlight.js';

// Custom renderer for code blocks
const renderer = new Renderer();

// Override code block rendering
renderer.code = function (code: string, lang: string | undefined): string {
    if (lang && hljs.getLanguage(lang)) {
        try {
            const highlighted = hljs.highlight(code, { language: lang }).value;
            return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
        } catch (err) {
            console.error('Highlight error:', err);
        }
    }

    // Auto-detect language
    const highlighted = hljs.highlightAuto(code).value;
    return `<pre><code class="hljs">${highlighted}</code></pre>`;
};

// marked 설정
marked.setOptions({
    renderer,
    breaks: true,
    gfm: true,
});

export { marked };
