// function dedupeLinks(markdown = "") {
//   const paragraphs = markdown.split(/\n\s*\n/);

//   const linkRe = /\[([^\]]+)]\(([^)]+)\)/g;

//   const paraStats = paragraphs.map((para) => {
//     const links = [...para.matchAll(linkRe)];
//     return {
//       totalLinks: links.length,
//       urls: links.map((m) => m[2]),
//     };
//   });

//   const urlLocations = new Map();
//   paraStats.forEach(({ urls }, idx) => {
//     urls.forEach((url) => {
//       if (!urlLocations.has(url)) urlLocations.set(url, new Set());
//       urlLocations.get(url).add(idx);
//     });
//   });

//   const keeper = new Map();
//   urlLocations.forEach((idxSet, url) => {
//     const idxArr = [...idxSet].sort((a, b) => {
//       const diff = paraStats[a].totalLinks - paraStats[b].totalLinks;
//       return diff !== 0 ? diff : a - b;
//     });
//     keeper.set(url, idxArr[0]);
//   });

//   const processedParagraphs = paragraphs.map((para, pIdx) => {
//     const seenInPara = new Set();

//     return para.replace(linkRe, (full, text, url) => {
//       const isKeeperPara = keeper.get(url) === pIdx;
//       const firstInPara = !seenInPara.has(url);

//       seenInPara.add(url);
//       return isKeeperPara && firstInPara ? full : text;
//     });
//   });

//   return processedParagraphs.join("\n\n");
// }

// const markdown = `Heavy paragraph (3 links):
// [GitHub](https://github.com) – check the code,
// consult the [docs](https://nodejs.org),
// and explore the [community](https://github.com).

// Light paragraph (1 link):
// [GitHub](https://github.com)
// `;

// const markdown2 = `First paragraph has two links:
// [Google](https://google.com) and [OpenAI](https://openai.com).

// Second paragraph also has two links:
// [Google](https://google.com) and [Bing](https://bing.com).
// `;

// const markdown3 = `Here’s a search engine: [Google](https://google.com).
// Need it again? [search](https://google.com).
// And here’s something else: [OpenAI](https://openai.com).
// `;

// console.log({ dedupeLinks: dedupeLinks(markdown) });
// console.log({ dedupeLinks2: dedupeLinks(markdown2) });
// console.log({ dedupeLinks3: dedupeLinks(markdown3) });

const tldjs = require("tldjs");

function getBaseDomain(url) {
  try {
    const { protocol } = new URL(url);
    const domain = tldjs.getDomain(url);
    if (!domain) {
      return null;
    }
    return `${protocol}//${domain}`;
  } catch (e) {
    console.error("Invalid URL:", e);
    return null;
  }
}

async function asyncReplace(str, regex, asyncFn) {
  const matches = [];
  str.replace(regex, (...args) => {
    const match = args[0];
    const offset = args[args.length - 2];
    const groups = args.slice(1, -2);
    matches.push({ match, offset, groups });
  });
  if (matches.length === 0) return str;

  const repls = await Promise.all(
    matches.map(({ match, groups, offset }) =>
      asyncFn(match, ...groups, offset)
    )
  );

  let out = "",
    last = 0;
  matches.forEach(({ match, offset }, i) => {
    out += str.slice(last, offset) + repls[i];
    last = offset + match.length;
  });
  return out + str.slice(last);
}

async function relevantLinks(markdown, rootURL, allowList = []) {
  const siteBase = getBaseDomain(rootURL);
  if (!siteBase) return markdown;

  const { hostname: rootHost, origin: rootOrigin } = new URL(siteBase);
  const linkRe = /\[([^\]]+)]\(([^)]+)\)/g;

  return asyncReplace(markdown, linkRe, async (full, text, rawUrl) => {
    let url;
    try {
      url = new URL(rawUrl, siteBase);
    } catch {
      return text;
    }

    const sameHost = url.hostname === rootHost;
    const isRoot =
      url.origin === rootOrigin && url.pathname.replace(/\/+$/, "") === "";

    if (sameHost && isRoot) return text;
    if (!sameHost && !allowList.some((d) => url.hostname.endsWith(d)))
      return text;

    try {
      const r = await fetch(url.href, { method: "HEAD" });
      if (!r.ok) return text;
    } catch {
      return text;
    }

    return full;
  });
}

const markdown = `
Welcome to our [homepage](/).  

Read the full story on our [About page](/about).

Search the web with [Google](https://google.com).

Broken demo: [dead link](/does-not-exist).

Malformed URL: [oops](ht!tp://bad).

Absolute root again: [index](https://www.azdesign.se/sv/articles/954/restaurangmaskiner)
Absolute root again: [index](https://azdesign.se/sv/articles/954/restaurangmaskiner)
Absolute root again: [index](https://azdesign.se/sv/articles/restaurangmaskiner)
`;

// --- root of your own site -------------------------------------------
const rootURL = "https://www.azdesign.se";

// --- run the function -------------------------------------------------

(async () => {
  const cleaned = await relevantLinks(markdown, rootURL);
  console.log("=== cleaned markdown ===\n");
  console.log(cleaned);
})();
