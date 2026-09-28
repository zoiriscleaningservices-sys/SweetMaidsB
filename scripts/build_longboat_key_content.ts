import fs from 'fs';
import path from 'path';

// Definition of all 53 pages with bespoke content for Longboat Key
import { pageDefinitions } from './longboat_definitions';

function wordCount(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

let hasErrors = false;

// Quality checks before emitting
for (const [key, page] of Object.entries(pageDefinitions)) {
  // 1. Meta description length: 140 - 155
  const metaLen = page.metaDescription.length;
  if (metaLen < 140 || metaLen > 155) {
    console.error(`[ERROR] Meta length for ${key} is ${metaLen} (must be 140-155): "${page.metaDescription}"`);
    hasErrors = true;
  }

  // 2. Title check
  if (!page.title.endsWith(' | Sweet Maid Cleaning Service')) {
    console.error(`[ERROR] Title format for ${key} must end with ' | Sweet Maid Cleaning Service': "${page.title}"`);
    hasErrors = true;
  }
  if (!page.title.includes('Longboat Key, FL')) {
    console.error(`[ERROR] Title for ${key} must include 'Longboat Key, FL': "${page.title}"`);
    hasErrors = true;
  }

  // 3. Primary keyword in intro first 100 words
  const introWords = page.introParagraph.split(/\s+/).slice(0, 100).join(' ');
  const kwLower = page.primaryKeyword.toLowerCase();
  if (!introWords.toLowerCase().includes(kwLower)) {
    console.error(`[ERROR] Primary keyword "${page.primaryKeyword}" not found in first 100 words of intro for ${key}`);
    hasErrors = true;
  }

  // 4. Primary keyword in H2
  if (!page.h2Keyword.toLowerCase().includes(kwLower)) {
    console.error(`[ERROR] Primary keyword "${page.primaryKeyword}" not found in h2Keyword for ${key}: "${page.h2Keyword}"`);
    hasErrors = true;
  }

  // 5. FAQs: 4-6 questions, each 40-80 words
  if (page.faqs.length < 4 || page.faqs.length > 6) {
    console.error(`[ERROR] FAQ count for ${key} is ${page.faqs.length} (must be 4-6)`);
    hasErrors = true;
  }
  page.faqs.forEach((faq, idx) => {
    const wc = wordCount(faq.a);
    if (wc < 40 || wc > 80) {
      console.error(`[ERROR] FAQ #${idx + 1} for ${key} word count is ${wc} (must be 40-80 words): "${faq.a}"`);
      hasErrors = true;
    }
  });

  // 6. Internal links: 3-5 links
  if (page.internalLinks.length < 3 || page.internalLinks.length > 5) {
    console.error(`[ERROR] Internal links count for ${key} is ${page.internalLinks.length} (must be 3-5)`);
    hasErrors = true;
  }
}

// Prohibited phrases check
const prohibitedPatterns = [
  { name: '#1', regex: /#1|No\.\s*1|number\s*one\s*rated/i },
  { name: 'Best', regex: /\bBest\b/ },
  { name: 'leading provider', regex: /leading\s+provider/i },
  { name: 'premier', regex: /\bpremier\b/i },
  { name: 'top-rated', regex: /top[- ]rated/i },
  { name: '24/7', regex: /24\/7/i },
  { name: 'Sweet Mind', regex: /Sweet\s*Mind/i },
  { name: 'Southwest Florida', regex: /Southwest\s+Florida/i },
  { name: 'Westbrook', regex: /Westbrook/i },
  { name: 'From the beaches to the ranch', regex: /beaches\s+to\s+the\s+ranch/i }
];

for (const [key, page] of Object.entries(pageDefinitions)) {
  const allText = [
    page.title,
    page.metaDescription,
    page.h1,
    page.introParagraph,
    page.h2Keyword,
    ...page.secondaryH2s,
    ...page.bodyParagraphs,
    ...page.faqs.map(f => `${f.q} ${f.a}`),
    ...page.internalLinks.map(l => l.anchor)
  ].join(' ');

  for (const prob of prohibitedPatterns) {
    if (prob.regex.test(allText)) {
      console.error(`[ERROR] Prohibited phrase "${prob.name}" found in ${key}`);
      hasErrors = true;
    }
  }

  // Check for ranch: only allowed as part of "Bradenton–Lakewood Ranch base" or "Bradenton-Lakewood Ranch base"
  const ranchMatches = allText.match(/\branch\b/gi);
  if (ranchMatches) {
    const cleaned = allText.replace(/Bradenton[–-]Lakewood Ranch base/gi, '');
    if (/\branch\b/i.test(cleaned)) {
      console.error(`[ERROR] Unauthorized occurrence of "ranch" in ${key}`);
      hasErrors = true;
    }
  }
}

if (hasErrors) {
  console.error("Validation failed. Fix errors above before generating longboat_key_content.ts.");
  process.exit(1);
} else {
  console.log("All 53 page definitions PASSED validation! Emitting src/lib/longboat_key_content.ts...");
  const fileContent = `// Bespoke Longboat Key Content Engine
// AUTO-GENERATED from validated page definitions. Do not edit directly.

export interface LongboatFaq {
  q: string;
  a: string;
}

export interface LongboatInternalLink {
  href: string;
  anchor: string;
}

export interface LongboatPageData {
  slug: string;
  route: string;
  oldTitle: string;
  title: string;
  h1: string;
  metaDescription: string;
  primaryKeyword: string;
  introParagraph: string;
  h2Keyword: string;
  secondaryH2s: string[];
  bodyParagraphs: string[];
  faqs: LongboatFaq[];
  internalLinks: LongboatInternalLink[];
  weakRelevance: boolean;
  verifyItems: string[];
}

export const longboatKeyPages: Record<string, LongboatPageData> = ${JSON.stringify(pageDefinitions, null, 2)};
`;

  fs.writeFileSync(path.join(process.cwd(), 'src', 'lib', 'longboat_key_content.ts'), fileContent, 'utf8');
  console.log("Successfully generated src/lib/longboat_key_content.ts!");
}
