const cheerio = require("cheerio");
const Fuse = require("fuse.js");
const { matchSorter } = require("match-sorter");

// Sample HTML content
const html = `
<head>
  <meta name="description" content="Inredning för Kök & Matsal med funktionell planering och hållbara material. Skapa gästvänliga miljöer – boka gratis konsultation med AZ Design.">
</head>
<body>
  <h1>Kök och matsal som hjärta i offentliga miljöer</h1>
  <p>Kök och matsal är mycket mer än platser där mat tillagas och serveras. I restauranger, hotell, skolor, företag och andra offentliga verksamheter fungerar dessa ytor som samlingspunkter, nav för samtal och atmosfärbyggare. Att skapa kök och matsal som stödjer och förstärker verksamhetens syfte är en process där allt från möbler och layout till materialval spelar en avgörande roll.</p>
</body>
`;

// Load HTML into Cheerio
const $ = cheerio.load(html);

// Define the keyword
const keyword = "Kök & matsal";

// Function to perform fuzzy search
function fuzzySearch(text, keyword) {
  const fuse = new Fuse([text], {
    includeScore: true,
    threshold: 0.3,
    ignoreLocation: true,
  });
  const result = fuse.search(keyword);
  return result.length > 0 && result[0].score <= 0.3;
}

// Check H1 tag
const h1Text = $("h1").text();
const h1Match = fuzzySearch(h1Text, keyword);

// Check first 100 words of body text
const bodyText = $("body").text().replace(/\s+/g, " ").trim();
const first100Words = bodyText.split(" ").slice(0, 100).join(" ");
const first100Match = fuzzySearch(first100Words, keyword);

// Check meta description
const metaDescription = $('meta[name="description"]').attr("content") || "";
const metaMatch = fuzzySearch(metaDescription, keyword);

const matchSorterh1 = matchSorter(h1Text, keyword);
console.log({ matchSorterh1 });

// Output results
console.log(`✅ Keyword in H1 tag: ${h1Match}`);
console.log(`✅ Keyword in first 100 words: ${first100Match}`);
console.log(`✅ Keyword in meta description: ${metaMatch}`);
