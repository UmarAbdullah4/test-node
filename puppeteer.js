// /**
//  * scrape-top-level.js
//  *
//  * Usage:
//  *   node scrape-top-level.js https://example.com
//  *
//  * Installs:
//  *   npm install puppeteer axios p-limit url
//  */

// const puppeteer = require("puppeteer");
// const axios = require("axios");
// const { URL } = require("url");

// if (process.argv.length < 3) {
//   console.error("Usage: node scrape-top-level.js <root-url>");
//   process.exit(1);
// }

// const ROOT = process.argv[2].replace(/\/+$/, "");
// const ORIGIN = new URL(ROOT).origin;
// const CONCURRENCY = 5;
// const TIMEOUT = 15000;

// // Simple HEAD‐ping
// async function isLive(href) {
//   try {
//     const res = await axios.head(href, { timeout: 10000, maxRedirects: 5 });
//     return res.status === 200;
//   } catch {
//     return false;
//   }
// }

// // Compute path‐depth: number of non‐empty segments
// function depth(href) {
//   return href
//     .replace(ORIGIN, "")
//     .split("/")
//     .filter((s) => s.length > 0).length;
// }

// (async () => {
//   const pLimit = (await import("p-limit")).default;
//   //   const browser = await puppeteer.launch({ headless: "new" });
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   await page.goto(ROOT, { waitUntil: "networkidle2", timeout: TIMEOUT });

//   // 1. Try semantic/ARIA + common-class selectors
//   const navSelectors = [
//     "nav",
//     '[role="navigation"]',
//     "header nav",
//     ".navbar",
//     ".main-menu",
//     "[id*=nav]",
//     "[class*=menu]",
//   ];

//   let hrefs = [];
//   for (const sel of navSelectors) {
//     const els = await page.$$(sel);
//     if (!els.length) continue;
//     // gather all <a> under this first matching container
//     hrefs = await page.$$eval(`${sel} a[href]`, (as) =>
//       as.map((a) => a.getAttribute("href").trim())
//     );
//     if (hrefs.length) break;
//   }

//   // 2. Fallback: global <a> scan + domain + depth ≤ 1
//   if (!hrefs.length) {
//     hrefs = await page.$$eval("a[href]", (as) =>
//       as.map((a) => a.getAttribute("href").trim())
//     );
//   }

//   // 3. Resolve absolute, filter domain & path‐depth, dedupe
//   const absSet = new Set();
//   for (let href of hrefs) {
//     if (!href || href.startsWith("#") || href.startsWith("mailto:")) continue;
//     try {
//       const abs = new URL(href, ORIGIN)
//         .toString()
//         .replace(/[#?].*$/, "") // strip fragment & query
//         .replace(/\/+$/, ""); // strip trailing slash
//       if (abs.startsWith(ORIGIN) && depth(abs) <= 1) {
//         absSet.add(abs);
//       }
//     } catch {}
//   }
//   const candidates = Array.from(absSet);

//   // 4. HEAD-ping + metadata fetch with limited concurrency
//   const limit = pLimit(CONCURRENCY);
//   const results = await Promise.all(
//     candidates.map((url) =>
//       limit(async () => {
//         if (!(await isLive(url))) return null;

//         // open a new tab JUST long enough for head
//         const tab = await browser.newPage();
//         await tab
//           .goto(url, { waitUntil: "domcontentloaded", timeout: TIMEOUT })
//           .catch(() => {});
//         const title = await tab.title().catch(() => url);
//         const desc = await tab
//           .$eval(
//             'meta[name="description"], meta[property="og:description"]',
//             (el) => el.getAttribute("content")
//           )
//           .catch(() => "")
//           .then((t) => t.trim());
//         await tab.close();

//         return { title: title.trim() || url, url, desc };
//       })
//     )
//   );

//   await browser.close();

//   // 5. Emit Markdown, dropping any nulls
//   for (const entry of results) {
//     if (!entry) continue;
//     const { title, url, desc } = entry;
//     console.log(`[${title}](${url})${desc ? " " + desc : ""}`);
//   }
// })();

// function createDynamicMarkdownTable(jsonArray) {
//   if (jsonArray.length === 0) {
//     return "No data to display.";
//   }

//   const headers = Object.keys(jsonArray[0]);

//   const columnWidths = headers.map((header) => {
//     return (
//       Math.max(
//         header.length,
//         ...jsonArray?.map((item) =>
//           item[header] ? item[header].toString().trim().length : 0
//         )
//       ) + 2
//     );
//   });

//   function padCell(content, width) {
//     return content.toString().padEnd(width - 2, " ");
//   }

//   let markdown =
//     "| " +
//     headers
//       .map((header, index) => padCell(header, columnWidths[index]))
//       .join(" | ") +
//     " |\n";

//   markdown +=
//     "|" + columnWidths.map((width) => "-".repeat(width)).join("|") + "|\n";

//   jsonArray.forEach((item) => {
//     const rowData = headers.map((header, index) =>
//       padCell(
//         item[header] ? item[header].toString().trim() : "",
//         columnWidths[index]
//       )
//     );
//     markdown += "| " + rowData.join(" | ") + " |\n";
//   });

//   return markdown;
// }

//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================

// function createDynamicMarkdownTable(jsonArray) {
//   // Check for null, undefined, or empty jsonArray
//   if (!jsonArray || jsonArray.length === 0) {
//     return "No data to display.";
//   }

//   // Extract headers from the first object
//   // Assumes all objects in the array have a similar structure,
//   // using the first object's keys as the source for all headers.
//   const headers = Object.keys(jsonArray[0]);

//   // Check if headers were actually found
//   if (headers.length === 0) {
//     return "No data to display: The objects in the array have no properties to form columns.";
//   }

//   // Calculate the maximum width for each column
//   // Each width includes +2 for padding spaces (e.g., " | ")
//   const columnWidths = headers.map((header) => {
//     const headerLength = header ? header.toString().length : 0;
//     const maxLengthInData = Math.max(
//       0, // Ensure Math.max doesn't get NaN if jsonArray is empty (though checked above)
//       ...jsonArray.map((item) => {
//         const value = item[header];
//         return value !== null && typeof value !== "undefined"
//           ? value.toString().trim().length
//           : 0;
//       })
//     );
//     return Math.max(headerLength, maxLengthInData) + 2;
//   });

//   // Helper function to pad cell content
//   // Content is padded to the maximum length of data/header in that column
//   function padCell(content, width) {
//     const contentStr =
//       content !== null && typeof content !== "undefined"
//         ? content.toString().trim()
//         : "";
//     // `width - 2` is the target length for the content itself within the cell
//     return contentStr.padEnd(width - 2, " ");
//   }

//   // Build the header row
//   let markdown =
//     "| " +
//     headers
//       .map((header, index) => padCell(header, columnWidths[index]))
//       .join(" | ") +
//     " |\n";

//   // Build the separator row
//   // Ensures each column separator has at least 3 dashes,
//   // and matches the calculated column width for visual alignment in raw Markdown.
//   markdown +=
//     "|" +
//     columnWidths
//       .map((width) => "-".repeat(Math.max(3, width))) // Corrected: Ensures at least 3 dashes and uses full width
//       .join("|") +
//     "|\n";

//   // Build the data rows
//   jsonArray.forEach((item) => {
//     const rowData = headers.map((header, index) =>
//       padCell(item[header], columnWidths[index])
//     );
//     markdown += "| " + rowData.join(" | ") + " |\n";
//   });

//   return markdown;
// }
// const {
//   RecursiveUrlLoader,
// } = require("@langchain/community/document_loaders/web/recursive_url");
// const { saveJson, readJson } = require("./common");
// const cheerio = require("cheerio"); // npm install cheerio
// const { URL } = require("url");
// const OpenAI = require("openai");
// require("dotenv").config({ path: ".env" });

// const client = new OpenAI({
//   apiKey: process.env.API_KEY_OPENAI,
// });

// (async () => {
//   // const rootUrl = "https://www.azdesign.se/";
//   // // const rootUrl = "https://www.ikea.com/us/en/";
//   // // const rootUrl = "https://www.nike.com/";
//   // // const rootUrl = "https://www.uniqlo.com/us/en/";
//   // // const rootUrl = "https://indiehackers.com/";

//   // // const rootUrl = "https://abswheels.se";
//   // // const rootUrl = "https://proport.se/";

//   // const rootNorm = rootUrl.replace(/\/+$/, ""); // strip trailing slash once
//   // const loader = new RecursiveUrlLoader(rootUrl, { maxDepth: 1 });
//   // const docs = await loader.load();
//   // saveJson(docs, "docs.json");
//   const docs = readJson("docs.json");
//   const allLinks = [];

//   const extractBreadcrumbs = ($) => {
//     // 1) JSON-LD
//     const jsonLd = $('script[type="application/ld+json"]')
//       .map((_, el) => {
//         try {
//           return JSON.parse($(el).contents().text());
//         } catch {
//           return null;
//         }
//       })
//       .get()
//       .filter((obj) => obj && obj["@type"] === "BreadcrumbList")
//       .shift();
//     if (jsonLd && Array.isArray(jsonLd.itemListElement)) {
//       return jsonLd.itemListElement
//         .map((el) => el.name?.trim())
//         .filter(Boolean);
//     }

//     // 2) Microdata
//     const mdItems = [];
//     $('[itemtype="http://schema.org/BreadcrumbList"]')
//       .find('[itemprop="itemListElement"]')
//       .each((_, li) => {
//         const name = $(li).find('[itemprop="name"]').text().trim();
//         if (name) mdItems.push(name);
//       });
//     if (mdItems.length) return mdItems;

//     // 3) ARIA / class-based fallback
//     const fallbackSelectors = [
//       '[aria-label="breadcrumb"]',
//       '[aria-label*="breadcrumb"]',
//       ".breadcrumb",
//       ".breadcrumbs",
//       'nav[role="navigation"][aria-label*="breadcrumb"]',
//       "ul.breadcrumb",
//       "ol.breadcrumb",
//     ];
//     for (const sel of fallbackSelectors) {
//       const container = $(sel).first();
//       if (container.length) {
//         return container
//           .find("a, li, span")
//           .map((_, el) => $(el).text().trim())
//           .get()
//           .filter(Boolean);
//       }
//     }

//     return [];
//   };

//   for (const item of docs) {
//     const html = item.pageContent || "";
//     const baseUrl = item.metadata?.source || item.metadata?.url || rootUrl;
//     const $ = cheerio.load(html);
//     const body = $("body").html() || "";
//     const $$ = cheerio.load(body);
//     // const breadcrumbs = extractBreadcrumbs($);

//     $$("a[href]").each((_, el) => {
//       let href = $$(el).attr("href")?.trim();
//       if (!href) return;

//       if (
//         href === "/" ||
//         href === "#" ||
//         href.startsWith("#") ||
//         href.startsWith("mailto:") ||
//         href.startsWith("tel:") ||
//         href.startsWith("/?") ||
//         href.startsWith("?")
//       )
//         return;

//       try {
//         const absUrl = new URL(href, baseUrl).toString().replace(/\/+$/, "");

//         if (absUrl === rootNorm) return;

//         const urlObj = new URL(absUrl);
//         if (
//           !/^https?:$/.test(urlObj.protocol) ||
//           !urlObj.hostname ||
//           urlObj.search ||
//           urlObj.hash
//         )
//           return;
//         const title = $$(el).text().trim().toLocaleLowerCase();
//         const url = new URL(href, rootUrl);
//         const root = new URL(rootUrl);

//         if (
//           !title || // empty/null/undefined
//           typeof title !== "string" ||
//           title.length < 2 || // too short
//           title.length > 80 || // too long
//           /<\/?[a-z][\s\S]*>/i.test(title) || // contains HTML tags
//           /^[^\w\d]+$/.test(title) || // only punctuation/symbols
//           // title.split(" ").filter(Boolean).length <= 1 || // only 1 word
//           /\s{3,}/.test($$(el).text()) || // original text had 3+ consecutive spaces
//           // /^(learn more|read more|click here|shop now|view details)$/i.test(
//           //   title
//           // ) ||
//           url.hostname !== root.hostname // generic junk
//         )
//           return;

//         allLinks.push({
//           href: absUrl,
//           title,
//           // breadcrumbs,
//         });
//       } catch {
//         return;
//       }
//     });
//   }

//   const seen = new Set();
//   const uniqueLinks = allLinks.filter((link) => {
//     if (seen.has(link.href)) return false;
//     seen.add(link.href);
//     return true;
//   });

//   const urlMap = new Map(
//     uniqueLinks.map((link) => [link.href.replace(/\/+$/, ""), link])
//   );

//   uniqueLinks.forEach((link) => {
//     const urlObj = new URL(link.href);
//     const segments = urlObj.pathname.split("/").filter(Boolean);

//     let parent = rootNorm;
//     for (let i = segments.length - 1; i > 0; i--) {
//       const parentPath = "/" + segments.slice(0, i).join("/");
//       const candidate = new URL(parentPath, rootUrl)
//         .toString()
//         .replace(/\/+$/, "");
//       if (urlMap.has(candidate)) {
//         parent = candidate;
//         break;
//       }
//     }

//     // link.parent = parent;
//   });
//   const tree = {};
//   uniqueLinks.forEach((link) => {
//     const p = link.parent;
//     tree[p] = tree[p] || [];
//     tree[p].push(link);
//   });

//   const result = {
//     root: rootUrl,
//     totalUniqueLinks: uniqueLinks.length,
//     links: uniqueLinks,
//     topTree: Object.values(tree)[0],
//     tree,
//   };
//   saveJson(result, "recursiveUrlLoader.cleanedUniqueLinks.json");
//   saveJson(
//     createDynamicMarkdownTable(uniqueLinks?.topTree),
//     "recursiveUrlLoader.cleanedUniqueLinks.md"
//   );

// const prompt = `You are an expert web scraper specializing in structured data extraction from websites. Your role is to accurately and efficiently extract verified top-level navigation links from a user-provided website. You must ensure all collected data is clean, validated, and follows strict output formatting requirements.

// **Visit the user-provided root domain:** [${rootUrl}](${rootUrl})

// **Extracted Links:**
// ${createDynamicMarkdownTable(uniqueLinks?.topTree)}

// **Instructions:**

// 1. Identify **top-level pages** listed in the site's **main navigation menu** (i.e., the primary menu or navigation bar).

//    - **Page Title**
//    - **Full Absolute URL**

// 4. **Exclude** any URLs that is not top-level.

// **Output Format (Required):**

// - Present each verified URL in the following format:
//   "[Page Title](Full URL) brief description of the URL"

// **Rules:**

// - Do **not** include any extra content, metadata, headers, footers, or explanatory notes.
// - Only return the verified, live URLs that meet the above criteria.
// - Remove any invalid or unreachable URLs from the final output.`;

// const completion = await client.chat.completions.create({
//   model: "gpt-4o-search-preview",
//   messages: [
//     {
//       role: "user",
//       content: prompt,
//     },
//   ],
// });

// console.log(completion.choices[0].message.content);

//   // saveJson(completion.choices[0].message.content, "verified.md");
// })();

//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================

const {
  RecursiveUrlLoader,
} = require("@langchain/community/document_loaders/web/recursive_url");
const { saveJson, readJson } = require("./common");
const cheerio = require("cheerio"); // npm install cheerio
const { URL } = require("url");
const OpenAI = require("openai");
require("dotenv").config({ path: ".env" });
const { stringSimilarity } = require("string-similarity-js");
const { similar } = require("./cosine");

const client = new OpenAI({
  apiKey: process.env.API_KEY_OPENAI,
});

(async () => {
  const rootUrl = "https://www.azdesign.se/";
  // const rootUrl = "https://www.ikea.com/us/en/";
  // const rootUrl = "https://www.nike.com/";
  // const rootUrl = "https://www.uniqlo.com/us/en/";
  // const rootUrl = "https://indiehackers.com/";

  // const rootUrl = "https://abswheels.se";
  // const rootUrl = "https://proport.se/";

  const rootNorm = rootUrl.replace(/\/+$/, ""); // strip trailing slash once
  const loader = new RecursiveUrlLoader(rootUrl, { maxDepth: 1 });
  const docs = await loader.load();
  saveJson(docs, "docs.json");
  // const docs = readJson("docs.json");
  const allLinks = [];
  const limitedDocs = docs.slice(0, 20);
  for (const item of limitedDocs) {
    const pageURLS = [];
    const html = item.pageContent || "";
    const baseUrl = item.metadata?.source || item.metadata?.url || rootUrl;
    const $ = cheerio.load(html);
    const body = $("body").html() || "";
    const $$ = cheerio.load(body);
    // const breadcrumbs = extractBreadcrumbs($);
    console.log({ baseUrl });
    $$("a[href]").each((_, el) => {
      let href = $$(el).attr("href")?.trim();
      if (!href) return;

      if (
        href === "/" ||
        href === "#" ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("/?") ||
        href.startsWith("?")
      )
        return;

      try {
        const absUrl = new URL(href, baseUrl).toString().replace(/\/+$/, "");

        if (absUrl === rootNorm) return;

        const urlObj = new URL(absUrl);
        if (
          !/^https?:$/.test(urlObj.protocol) ||
          !urlObj.hostname ||
          urlObj.search ||
          urlObj.hash
        )
          return;
        const title = $$(el).text().trim().toLocaleLowerCase();
        const url = new URL(href, rootUrl);
        const root = new URL(rootUrl);

        if (
          !title || // empty/null/undefined
          typeof title !== "string" ||
          title.length < 2 || // too short
          title.length > 80 || // too long
          /<\/?[a-z][\s\S]*>/i.test(title) || // contains HTML tags
          /^[^\w\d]+$/.test(title) || // only punctuation/symbols
          // title.split(" ").filter(Boolean).length <= 1 || // only 1 word
          /\s{3,}/.test($$(el).text()) || // original text had 3+ consecutive spaces
          // /^(learn more|read more|click here|shop now|view details)$/i.test(
          //   title
          // ) ||
          url.hostname !== root.hostname // generic junk
        )
          return;

        pageURLS.push({
          href: absUrl,
          title,
          // breadcrumbs,
        });
      } catch {
        return;
      }
    });

    const seen = new Set();
    const uniqueLinks = pageURLS.filter((link) => {
      if (seen.has(link.href)) return false;
      seen.add(link.href);
      return true;
    });

    const urlMap = new Map(
      uniqueLinks.map((link) => [link.href.replace(/\/+$/, ""), link])
    );

    uniqueLinks.forEach((link) => {
      const urlObj = new URL(link.href);
      const segments = urlObj.pathname.split("/").filter(Boolean);

      let parent = rootNorm;
      for (let i = segments.length - 1; i > 0; i--) {
        const parentPath = "/" + segments.slice(0, i).join("/");
        const candidate = new URL(parentPath, rootUrl)
          .toString()
          .replace(/\/+$/, "");
        if (urlMap.has(candidate)) {
          parent = candidate;
          break;
        }
      }
    });
    const tree = {};
    uniqueLinks.forEach((link) => {
      const p = link.parent;
      tree[p] = tree[p] || [];
      tree[p].push(link);
    });

    const result = {
      root: rootUrl,
      baseUrl: baseUrl,
      totalUniqueLinks: uniqueLinks.length,
      links: uniqueLinks,
      // topTree: Object.values(tree)[0],
      // tree,
    };

    allLinks.push(result);
  }
  saveJson(allLinks, "recursiveUrlLoader.cleanedUniqueLinks.json");

  // const allLinks = readJson("recursiveUrlLoader.cleanedUniqueLinks.json");
  // const allTitleLists = allLinks.map((o) => o.links.map((l) => l.title));
  const allHrefLists = allLinks.map((o) => o.links.map((l) => l.href));

  const countsMap = new Map();

  allLinks.forEach(({ links }) => {
    links.forEach(({ href, title }) => {
      if (!countsMap.has(href)) {
        countsMap.set(href, { href, title, count: 0 });
      }
      countsMap.get(href).count++;
    });
  });

  const counts = allLinks[0].links.map(({ href, title }) => ({
    href,
    title,
    count: countsMap.get(href).count,
  }));
  saveJson(counts, "linksCount.json");

  const url = "https://www.azdesign.se/";
  const keyword = "Stol James R";

  const prompt = `You are an expert web scraper specializing in structured data extraction from websites. Your job is to analyze the provided keyword and extracted URLs and return the 10 most relevant URL according to the provided keyword.
  
  You are provided with the following URL, keyword, and extracted links:

**URL:** ${url}

**Keyword:** ${keyword}

**Extracted Links:**
${counts?.map((l) => `[${l?.title}](${l?.href})\n`)}

**Instructions:**

1.  Identify the 10 URLs that most match the keyword. Consider:

    *   Page Title
    *   Full Absolute URL
2.  **Exclude** any URLs that are not top-level.
3.  Verify that the URLs are live and reachable.

**Output Format (Required):**

Present each verified URL in the following format:

"[Page Title](Full URL) brief description of the URL"

**Rules:**

*   Do **not** include any extra content, metadata, headers, footers, or explanatory notes.
*   Only return the verified, live URLs that meet the above criteria.
*   Remove any invalid or unreachable URLs from the final output.`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-search-preview",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  console.log(completion.choices[0].message.content);

  // similar("women", counts);
})();

function analyzeLinkArrays(allLinks, threshold = 0.85) {
  const lists = allLinks.map((o) => o.links.map((l) => l.href));
  let maxCommon = 0,
    bestPair = [null, null],
    bestCommon = [];

  for (let i = 0; i < lists.length; i++) {
    for (let j = i + 1; j < lists.length; j++) {
      const common = [];
      for (const a of lists[i]) {
        for (const b of lists[j]) {
          const score = stringSimilarity(a, b);
          console.log({ a, b, score });
          if (score >= threshold) {
            common.push({ a, b, score });
            break;
          }
        }
      }
      if (common.length > maxCommon) {
        maxCommon = common.length;
        bestPair = [i, j];
        bestCommon = common;
      }
    }
  }

  const counts = {};
  lists.flat().forEach((url) => {
    counts[url] = (counts[url] || 0) + 1;
  });

  return { bestPair, bestCommon, counts };
}
// const result = analyzeLinkArrays(allLinks, 0.85);
// saveJson(result, "linksAnalysis.json");

//   const intersection = [
//     ...allHrefLists.reduce(
//       (a, set) => new Set([...a].filter((x) => set.has(x)))
//     ),
//   ][0];
//  saveJson(allHrefLists, "allHrefLists.json");

// // 3) Frequency count across all objects
// const freq = {};
// allLinks.forEach((o) =>
//   o.links.forEach((l) => {
//     freq[l.href] = (freq[l.href] || 0) + 1;
//   })
// );

// // 4) Sort by descending frequency
// const mostCommon = Object.entries(freq)
//   .sort(([, a], [, b]) => b - a)
//   .map(([href, count]) => ({ href, count }));

// saveJson(intersection, "intersection.json");
// saveJson(mostCommon, "mostCommon.json");
