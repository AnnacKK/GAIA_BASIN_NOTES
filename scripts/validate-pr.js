import fs from 'fs';
import { execSync } from 'child_process';

let files = [];
try {
  execSync('git fetch origin main --depth=1', { stdio: 'ignore' });
  const output = execSync('git diff --name-only --diff-filter=d origin/main', { encoding: 'utf8' });
  files = output.split('\n')
    .map(f => f.trim())
    .filter(f => f.toLowerCase().endsWith('.md') && fs.existsSync(f));
} catch (e) {
  try {
    const output = execSync('git diff --name-only --diff-filter=d HEAD~1', { encoding: 'utf8' });
    files = output.split('\n')
      .map(f => f.trim())
      .filter(f => f.toLowerCase().endsWith('.md') && fs.existsSync(f));
  } catch (err) {
    console.error("Failed to retrieve git changes:", err);
  }
}

if (files.length === 0) {
  console.log("No markdown files added or modified in this PR. Skipping validation.");
  process.exit(0);
}

console.log(`Validating ${files.length} changed markdown file(s):`);
files.forEach(f => console.log(`  - ${f}`));

let hasErrors = false;

async function checkLink(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(10000)
    });
    
    if (response.status >= 200 && response.status < 400) {
      return { ok: true, status: response.status };
    }
    if ([401, 403, 405].includes(response.status)) {
      return { ok: true, warning: true, status: response.status };
    }
    return { ok: false, status: response.status };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

for (const file of files) {
  console.log(`\nChecking file: ${file}`);
  const content = fs.readFileSync(file, 'utf8');
  const urlRegex = /url:\s*["']?(https?:\/\/[^\s"']+)["']?/gi;
  let match;
  const urls = [];
  while ((match = urlRegex.exec(content)) !== null) {
    urls.push(match[1]);
  }
  
  if (urls.length === 0) {
    console.log("  No resource URLs found in this file.");
    continue;
  }
  
  console.log(`  Found ${urls.length} resource URL(s) to validate...`);
  
  for (const url of urls) {
    const res = await checkLink(url);
    if (res.ok) {
      if (res.warning) {
        console.log(`  [WARN] ${url} returned status ${res.status} (likely bot protection)`);
      } else {
        console.log(`  [OK]   ${url} (${res.status})`);
      }
    } else {
      hasErrors = true;
      if (res.error) {
        console.error(`  [FAIL] ${url} - Connection failed: ${res.error}`);
      } else {
        console.error(`  [FAIL] ${url} - Returned HTTP status ${res.status}`);
      }
    }
  }
}

if (hasErrors) {
  console.error("\n[ERROR] PR validation failed due to broken resource links.");
  process.exit(1);
} else {
  console.log("\n[SUCCESS] All resource links validated successfully!");
  process.exit(0);
}
