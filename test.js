const s_slug = 'house-cleaning';
const loc_slug = 'bradenton-fl';
let str = '<a href="/deep-cleaning/house-cleaning/">';
const regex1 = new RegExp(`href="/[^/]+/${s_slug}/"`, 'g');
let result = str.replace(regex1, `href="/${loc_slug}/${s_slug}/"`);
console.log("Result1:", result);

let str2 = '<a href="/house-cleaning/">';
const regex2 = new RegExp(`href="/${s_slug}/"`, 'g');
console.log("Result2:", str2.replace(regex2, `href="/${loc_slug}/${s_slug}/"`));

let str3 = '<a href="/house-cleaning/about/">';
console.log("Result3:", str3.replace(/href="\/[^/]+\/about\/"/g, `href="/${loc_slug}/about/"`));
