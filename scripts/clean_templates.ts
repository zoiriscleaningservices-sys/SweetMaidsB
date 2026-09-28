import fs from 'fs';
import path from 'path';

function cleanFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Westbrook / 34211
  content = content.replace(/14651\s+Westbrook\s+Cir(?:,\s*Apt\s*312)?,?\s*Bradenton,?\s*FL(?:\s*34211)?/gi, 'Serving Bradenton and nearby Florida communities');
  content = content.replace(/14651\s+Westbrook\s+Cir/gi, 'Serving Bradenton');
  content = content.replace(/Westbrook\s+Cir/gi, 'Bradenton Area');
  content = content.replace(/Westbrook/gi, 'Bradenton');
  content = content.replace(/\b34211\b/g, '34205');

  // Superlatives
  content = content.replace(/#1\s+Rated\s+Cleaning\s+Service/gi, 'Professional Cleaning Service');
  content = content.replace(/#1\s+Rated\s+Maid\s+Service/gi, 'Professional Maid Service');
  content = content.replace(/#1\s+Rated/gi, 'Professional');
  content = content.replace(/#1\s+Cleaning\s+Service/gi, 'Professional Cleaning Service');
  content = content.replace(/#1\s+Maid\s+Service/gi, 'Professional Maid Service');
  content = content.replace(/#1\s+Choice/gi, 'Top Choice');

  content = content.replace(/Top-Rated\s+Cleaning\s+Service/gi, 'Professional Cleaning Service');
  content = content.replace(/Top-Rated\s+Maid\s+Service/gi, 'Professional Maid Service');
  content = content.replace(/Top-Rated\s+Cleaners/gi, 'Professional Cleaners');
  content = content.replace(/Top-Rated\s+House\s+Cleaning/gi, 'Professional House Cleaning');
  content = content.replace(/Top-Rated/gi, 'Professional');

  content = content.replace(/5-Star\s+Rated/gi, 'Professional');
  content = content.replace(/5-Star\s+Perfection/gi, 'Meticulous Care');
  content = content.replace(/5-Star\s+Care/gi, 'Meticulous Care');
  content = content.replace(/5-Star\s+Quality/gi, 'High Quality');
  content = content.replace(/5-Star/gi, 'Professional');

  // Premier / Leading provider
  content = content.replace(/premier\s+statewide\s+provider/gi, 'dedicated statewide provider');
  content = content.replace(/premier\s+cleaning\s+solutions/gi, 'cleaning solutions');
  content = content.replace(/premier\s+cleaning\s+company/gi, 'professional cleaning company');
  content = content.replace(/premier\s+cleaning\s+service/gi, 'professional cleaning service');
  content = content.replace(/premier\s+provider/gi, 'reliable provider');
  content = content.replace(/premier\s+residential/gi, 'professional residential');
  content = content.replace(/premier\s+commercial/gi, 'professional commercial');
  content = content.replace(/\bthe\s+premier\b/gi, 'a leading');
  content = content.replace(/\bpremier\b/gi, 'professional');
  content = content.replace(/leading\s+provider\s+of\s+professional/gi, 'provider of professional');
  content = content.replace(/leading\s+provider/gi, 'dedicated provider');

  // 24/7
  content = content.replace(/24\/7\s+Emergency\s+Cleaning\s+Service/gi, 'Professional Cleaning Service');
  content = content.replace(/24\/7\s+Emergency\s+Service/gi, 'Professional Cleaning Service');
  content = content.replace(/24\/7\s+Emergency/gi, 'Prompt');
  content = content.replace(/24\/7\s+Cleaning/gi, 'Scheduled Cleaning');
  content = content.replace(/24\/7\s+Support/gi, 'Customer Support');
  content = content.replace(/24\/7/gi, 'Flexible Scheduling');

  // Guarantees
  content = content.replace(/100%\s+satisfaction\s+guaranteed/gi, 'quality cleaning assured');
  content = content.replace(/100%\s+Satisfaction\s+Guaranteed/gi, 'Quality Cleaning Assured');
  content = content.replace(/100%\s+Sparkle\s+Guarantee/gi, 'Quality Cleaning Care');
  content = content.replace(/satisfaction\s+guaranteed/gi, 'satisfaction focused');
  content = content.replace(/Satisfaction\s+Guaranteed/gi, 'Satisfaction Focused');

  // Licensed / Bonded / Insured
  content = content.replace(/licensed,\s+bonded,\s+and\s+insured/gi, 'professional, vetted, and trained');
  content = content.replace(/Licensed,\s+Bonded,\s+and\s+Insured/gi, 'Professional, Vetted, and Trained');
  content = content.replace(/Licensed\s+&\s+Insured/gi, 'Professional & Trained');
  content = content.replace(/licensed\s+and\s+insured/gi, 'professional and trained');
  content = content.replace(/Licensed\s+and\s+Insured/gi, 'Professional and Trained');
  content = content.replace(/multi-million\s+dollar\s+insured/gi, 'professional and trained');

  // Typo & slogan bugs
  content = content.replace(/\bSweet\s+Mind\b/g, 'Sweet Maid');
  content = content.replace(/From\s+the\s+beaches\s+to\s+the\s+ranch,?\s*(?:our teams are in your neighborhood daily\.\s*We treat your community like our own\.)?/gi, 'Serving homes and businesses across your neighborhood.');
  content = content.replace(/From\s+the\s+beaches\s+to\s+the\s+ranch/gi, 'Across your neighborhood');
  content = content.replace(/\bdeep\s+deep\b/gi, 'deep');

  // Unverified numbers
  content = content.replace(/799\+\s*Florida\s*cities/gi, 'Florida communities');
  content = content.replace(/all\s*799\+\s*cities/gi, 'our service communities');
  content = content.replace(/799\+\s*cities/gi, 'Florida communities');
  content = content.replace(/799\+/gi, 'multiple');
  content = content.replace(/5,000\+\s*houses/gi, 'numerous homes');
  content = content.replace(/5,000\+\s*homes/gi, 'numerous homes');
  content = content.replace(/1,200\+\s*post-construction/gi, 'numerous post-construction');

  // Pricing
  content = content.replace(/\$129\b/g, '$180');
  content = content.replace(/\$149\b/g, '$180');
  content = content.replace(/\$199\b/g, '$250');
  content = content.replace(/\$219\b/g, '$250');
  content = content.replace(/\$289\b/g, '$350');

  // Canonical URLs to www
  content = content.replace(/https:\/\/sweetmaidcleaning\.com(?=[/"'\s])/g, 'https://www.sweetmaidcleaning.com');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function walkDir(dir: string): number {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += walkDir(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      if (cleanFile(fullPath)) {
        count++;
      }
    }
  }
  return count;
}

const templatesDir = path.join(process.cwd(), 'templates');
const modified = walkDir(templatesDir);
console.log(`Cleaned ${modified} template files.`);
