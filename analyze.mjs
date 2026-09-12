import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';

const issues = {
    critical: [],
    high: [],
    medium: [],
    low: [],
    safe: []
};

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
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
    
    // Some variables for block detection (simplified)
    let isSafe = true;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // 1. Direct DOM manipulation
        if (/(document\.(querySelector|getElementById|createElement|appendChild|removeChild|replaceChild|insertBefore|write|body))/.test(line)) {
            // Check if it's inside useEffect - basic check
            issues.high.push({
                file: filePath,
                line: i + 1,
                reason: "Direct DOM manipulation found. Avoid direct DOM manipulation in React as it causes virtual DOM inconsistencies.",
                fix: "Use React refs (useRef) and state instead of direct DOM manipulation."
            });
            isSafe = false;
        }

        // 2. Hydration Mismatches (window, localStorage used during render)
        if (/(window\.|localStorage\.|sessionStorage\.|Math\.random\(\)|Date\.now\(\)|new Date\(\))/.test(line)) {
            // Simplistic check to avoid flagging standard API if not in render
            if (!line.includes('useEffect') && !line.includes('onClick') && !line.includes('=>')) {
               issues.critical.push({
                    file: filePath,
                    line: i + 1,
                    reason: `Potential hydration mismatch trigger (${line.trim()}). If this runs during server rendering, the output will differ from the client.`,
                    fix: `Wrap the usage in useEffect, or conditionally render only after a 'mounted' state becomes true.`
               });
               isSafe = false;
            }
        }
        
        // 3. dangerouslySetInnerHTML
        if (/dangerouslySetInnerHTML/.test(line)) {
            issues.medium.push({
                file: filePath,
                line: i + 1,
                reason: "dangerouslySetInnerHTML used. Ensure the content is sanitized to prevent XSS attacks and doesn't conflict with hydration.",
                fix: "Use DOMPurify or similar to sanitize HTML before injecting, or avoid if possible."
            });
            isSafe = false;
        }
        
        // 4. Missing use client on components with hooks
        if (!hasUseClient && /(useState|useEffect|useRef|useLayoutEffect)/.test(line)) {
             issues.critical.push({
                file: filePath,
                line: i + 1,
                reason: `Component uses React hooks (${line.trim()}) but is missing 'use client' directive. This causes errors in Server Components.`,
                fix: `Add "use client"; at the very top of the file.`
            });
            isSafe = false;
        }
        
        // Swiper usage without proper dynamic import or use client
        if (/import .* from ['"]swiper.*['"]/.test(line)) {
            issues.high.push({
                file: filePath,
                line: i + 1,
                reason: "Third-party DOM-manipulating library (Swiper) imported. Ensure it's only loaded on the client side to avoid hydration errors.",
                fix: "Use next/dynamic with ssr: false for components containing Swiper, or ensure proper initialization inside useEffect."
            });
            isSafe = false;
        }
    }
    
    if (isSafe) {
        issues.safe.push(filePath);
    }
}

walkDir(SRC_DIR, checkFile);

fs.writeFileSync('analysis.json', JSON.stringify(issues, null, 2));
console.log('Analysis complete!');
