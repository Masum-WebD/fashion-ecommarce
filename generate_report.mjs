import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';

let markdown = `# Frontend Debugging & Audit Report\n\n`;
markdown += `This report outlines all potential causes for DOM manipulation errors, hydration mismatches, and page load failures.\n\n`;

const categories = {
    critical: [],
    high: [],
    medium: [],
    low: []
};
const safeFiles = [];

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            walkDir(dirPath, callback);
        } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
            callback(dirPath);
        }
    });
}

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    let hasUseClient = content.includes('"use client"') || content.includes("'use client'");
    let isSafe = true;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // 1. Direct DOM manipulation
        if (/(document\.(querySelector|getElementById|createElement|appendChild|removeChild|replaceChild|insertBefore|write|body))/.test(line)) {
            categories.critical.push({
                file: filePath,
                line: i + 1,
                reason: "Direct DOM manipulation found (querySelector, getElementById, appendChild, insertBefore, document.body). React cannot track these changes, which leads to `Failed to execute 'insertBefore' on 'Node'` and `NotFoundError` when React's Virtual DOM tries to update these manually altered nodes.",
                fix: "Remove direct DOM methods. Use React `useRef` to reference elements, and React state to add, remove, or modify elements."
            });
            isSafe = false;
        }

        // 2. Hydration Mismatches (window, localStorage, sessionStorage, Math.random, Date)
        if (/(window\.|localStorage\.|sessionStorage\.|Math\.random\(\)|Date\.now\(\)|new Date\(\))/.test(line)) {
            if (!line.includes('useEffect') && !line.includes('onClick') && !line.includes('=>') && !line.includes('addEventListener') && !line.includes('removeEventListener')) {
               categories.high.push({
                    file: filePath,
                    line: i + 1,
                    reason: `Hydration mismatch risk: Used browser-only API or non-deterministic function \`${line.trim()}\` during the render phase. If this component is Server-Side Rendered (SSR), the server HTML will differ from the client HTML, causing React hydration to fail.`,
                    fix: "Wrap this logic in a `useEffect` hook, or ensure the component only renders this output after a `mounted` state becomes `true`."
               });
               isSafe = false;
            }
        }
        
        // 3. dangerouslySetInnerHTML
        if (/dangerouslySetInnerHTML/.test(line)) {
            categories.medium.push({
                file: filePath,
                line: i + 1,
                reason: "Use of `dangerouslySetInnerHTML`. If the injected HTML contains invalid markup or scripts, it can break the DOM structure or cause XSS vulnerabilities.",
                fix: "Ensure the HTML string is strictly sanitized using a library like DOMPurify before injection."
            });
            isSafe = false;
        }
        
        // 4. Missing use client on components with hooks
        if (!hasUseClient && /(useState|useEffect|useRef|useLayoutEffect|useReducer|useContext)\(/.test(line) && !filePath.includes('context')) {
             categories.critical.push({
                file: filePath,
                line: i + 1,
                reason: `Component uses React hooks (\`${line.trim()}\`) but is missing the \`"use client"\` directive. In Next.js App Router, components with hooks must be client components.`,
                fix: `Add \`"use client";\` as the very first line of the file.`
            });
            isSafe = false;
        }
        
        // 5. Third-party DOM-manipulating libraries (Swiper, jQuery)
        if (/import .* from ['"]swiper.*['"]/.test(line)) {
            categories.high.push({
                file: filePath,
                line: i + 1,
                reason: "Swiper library imported. Swiper heavily modifies the DOM layout (adding wrappers, duplicating slides for loops). This can clash with React's Virtual DOM and cause `removeChild` or `insertBefore` errors.",
                fix: "Ensure the component using Swiper is dynamically imported with `ssr: false`, or strictly initialized inside a `useEffect` loop. Verify `observer: true` and `observeParents: true` are used in Swiper config."
            });
            isSafe = false;
        }
    }
    
    if (isSafe) {
        safeFiles.push(filePath);
    }
}

walkDir(SRC_DIR, checkFile);

function appendSection(title, items) {
    markdown += `## ${title}\n\n`;
    if (items.length === 0) {
        markdown += `*No issues found in this category.*\n\n`;
        return;
    }
    
    const uniqueItems = {};
    items.forEach(item => {
        const key = `${item.file}-${item.reason}`;
        if (!uniqueItems[key]) {
             uniqueItems[key] = item;
        }
    });

    Object.values(uniqueItems).forEach(item => {
        markdown += `**File:** \`${item.file}\` (Line: ${item.line})\n`;
        markdown += `* **Explanation:** ${item.reason}\n`;
        markdown += `* **Fix:** ${item.fix}\n\n`;
    });
}

appendSection("Critical Issues", categories.critical);
appendSection("High Risk Issues", categories.high);
appendSection("Medium Risk Issues", categories.medium);
appendSection("Low Risk Issues", categories.low);

markdown += `## Config, Packages, and Browser Extensions Analysis\n\n`;
markdown += `### \`next.config.ts\` Issues\n`;
markdown += `- No strict issues found in \`next.config.ts\` that directly cause hydration mismatches, but the cache control headers \`max-age=31536000\` might aggressively cache mismatched assets across deployments. Ensure \`reactStrictMode: true\` is explicitly defined (it is missing) to proactively catch hydration errors in development.\n\n`;

markdown += `### \`package.json\` Incompatibilities\n`;
markdown += `- \`"next": "16.2.9"\`: Next.js 16 is not yet released officially. Ensure you are using a stable version (e.g., \`15.x.x\` or \`14.x.x\`) if possible.\n`;
markdown += `- \`"react": "19.2.4"\`: Similar to Next, ensure this React version aligns with your Next.js version to avoid compiler issues.\n`;
markdown += `- \`swiper^14.0.0\`: Swiper is notorious for causing \`insertBefore\`/\`removeChild\` errors in Next.js because it alters the DOM after hydration. Consider using \`embla-carousel-react\` (which is also in your package.json) as a React-friendly alternative.\n\n`;

markdown += `### Browser Extensions Impact (Google Translate, Grammarly, Dark Reader, etc.)\n`;
markdown += `- **Issue:** Extensions like Google Translate replace text nodes with \`<span><font>\` nodes. When React attempts to update or remove the original text node, it throws \`NotFoundError: The node to be removed is not a child of this node.\` or \`Failed to execute 'removeChild' on 'Node'\`.\n`;
markdown += `- **Fix:** To prevent translation tools from breaking your app, add \`translate="no"\` to the root \`<html>\` tag or specific container divs. However, for a production Next.js app, wrap text nodes inside \`<span>\` elements rather than having them as direct children of block elements, or use a robust hydration wrapper.\n\n`;

markdown += `## Safe Components\n\n`;
markdown += `The following files passed basic static analysis for these specific issues:\n`;
safeFiles.forEach(f => {
    markdown += `- \`${f}\`\n`;
});

fs.writeFileSync('C:/Users/Redwan/.gemini/antigravity-ide/brain/e85e18f6-b90d-411e-b4b9-1a0b80e75734/audit_report.md', markdown);
console.log('Report generated successfully!');
