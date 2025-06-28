//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================

// const {
//   RecursiveUrlLoader,
// } = require("@langchain/community/document_loaders/web/recursive_url");
// const { saveJson, readJson } = require("../common");
// const cheerio = require("cheerio"); // npm install cheerio
// const { URL } = require("url");
// const OpenAI = require("openai");
// require("dotenv").config({ path: ".env" });

// (async () => {
//   // const rootUrl = "https://www.azdesign.se/";
//   const rootUrl = "https://www.ikea.com/us/en/";
//   // const rootUrl = "https://www.nike.com/";
//   // const rootUrl = "https://www.uniqlo.com/us/en/";
//   // const rootUrl = "https://indiehackers.com/";
//   // const rootUrl = "https://abswheels.se";
//   // const rootUrl = "https://proport.se/";

//   const rootNorm = rootUrl.replace(/\/+$/, ""); // strip trailing slash once
//   const loader = new RecursiveUrlLoader(rootUrl, { maxDepth: 0 });
//   const docs = await loader.load();
//   const allLinks = [];

//   for (const item of docs) {
//     const html = item.pageContent || "";
//     const baseUrl = item.metadata?.source || item.metadata?.url || rootUrl;
//     const $ = cheerio.load(html);
//     const body = $("body").html() || "";
//     const $$ = cheerio.load(body);

//     const selectors = `
//     nav a, header a,
//     [role="navigation"] a, [role="menubar"] a,
//     *[class*="nav" i] a, *[class*="menu" i] a,
//     *[class*="top-bar" i] a, *[class*="appbar" i] a,
//     *[id*="nav" i] a, *[id*="menu" i] a, *[id*="header" i] a
//   `;

//     $$(selectors).each((_, el) => {
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
//   saveJson(result, `top-level.json`);
// })();

//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================

// (async () => {
//   const docs = await new RecursiveUrlLoader(rootUrl, { maxDepth: 0 }).load();
//   const linkBag = [];

//   const MAX_DOM_DEPTH = 6; // stop walking up after this many parents
//   const MAX_ANCHOR_PER_PASS = 80; // if first pass returns > N anchors → fallback

//   const containerSel = `
//   header,
//   nav,
//   [role="navigation"],
//   [role="menubar"],
//   aside[role="navigation"],
//   [aria-label*="primary" i],
//   [aria-label*="main" i],
//   *[class*="nav" i],
//   *[class*="navbar" i],
//   *[class*="menu" i],
//   *[class*="drawer" i],
//   *[class*="top-bar" i],
//   *[class*="appbar" i],
//   *[id*="nav" i],
//   *[id*="menu" i],
//   *[id*="header" i],
//   *[id*="sidebar" i]
// `
//     .trim()
//     .replace(/\s+/g, " ");

//   const anchorSel = "> a, > ul > li > a, > ol > li > a";

//   const FAST_SELECTORS = containerSel
//     .split(",")
//     .map((c) => `${c.trim()} ${anchorSel}`)
//     .join(",");

//   const NAV_ROOTS = containerSel; // unchanged, but named for clarity
//   for (const doc of docs) {
//     /* ------------------------------------------------------------------------ */
//     const html = doc.pageContent || "";
//     const baseUrl = stripWww(
//       doc.metadata?.source || doc.metadata?.url || rootUrl
//     );
//     const $ = cheerio.load(html);

//     const rootNorm = normalizeUrl("/", rootUrl); // used to skip home‑link
//     const seen = new Set(); // dedupe on absolute href

//     const isGoodText = (txt) => {
//       if (!txt || typeof txt !== "string") return false;
//       txt = txt.trim();
//       return (
//         txt.length >= 2 &&
//         txt.length <= 80 &&
//         !/<\/?[a-z][\s\S]*>/i.test(txt) && // no HTML fragments
//         !/^[^\w\d]+$/.test(txt) && // not just symbols
//         !/[\\\n\r\t]/.test(txt) && // no escapes
//         !/{{.*?}}/.test(txt) && // no templating braces
//         !/[a-zA-Z]{2,}\s{2,}[a-zA-Z]{2,}/.test(txt)
//       );
//     };

//     const pushLink = (href, text) => {
//       try {
//         const abs = normalizeUrl(href, baseUrl);
//         if (abs === rootNorm || seen.has(abs)) return; // home link | dup

//         const u = new URL(abs);
//         if (!/^https?:$/.test(u.protocol) || u.search || u.hash) return; // junk

//         const targetHost = stripWww(u.hostname);
//         const rootHost = stripWww(new URL(rootUrl).hostname);
//         if (targetHost !== rootHost) return; // external domain

//         if (!isGoodText(text)) return; // useless label
//         seen.add(abs);
//         linkBag.push({ href: abs, title: text.toLowerCase() });
//       } catch {
//         /* invalid URL → ignore */
//       }
//     };

//     $(FAST_SELECTORS).each((_, el) => {
//       const href = $(el).attr("href")?.trim();
//       if (!href || /^(#|mailto:|tel:|\?|\/?\?)/.test(href)) return;

//       let depth = 0;
//       let cur = $(el);
//       while (cur.length && !cur.is(NAV_ROOTS)) {
//         cur = cur.parent();
//         depth += 1;
//       }
//       if (depth > MAX_DOM_DEPTH) return;

//       pushLink(href, $(el).text());
//     });

//     if (linkBag.length === 0 || linkBag.length > MAX_ANCHOR_PER_PASS) {
//       let bestRoot = null;
//       let bestScore = -1;

//       $(NAV_ROOTS).each((_, root) => {
//         const score = $(root).find("a[href]").length;
//         if (score > bestScore) {
//           bestScore = score;
//           bestRoot = root;
//         }
//       });

//       if (bestRoot) {
//         $(bestRoot)
//           .find(anchorSel)
//           .each((_, el) => {
//             const href = $(el).attr("href")?.trim();
//             if (!href || /^(#|mailto:|tel:|\?|\/?\?)/.test(href)) return;
//             pushLink(href, $(el).text());
//           });
//       }
//     }
//   }

//   const uniq = Array.from(new Map(linkBag.map((o) => [o.href, o])).values());

//   const hrefSet = new Set(uniq.map((l) => l.href));

//   function keepIfNoParentExists(href) {
//     let cur = href.replace(/\/+$/, "");
//     while (cur.startsWith(rootNorm) && cur.length > rootNorm.length) {
//       cur = cur.slice(0, cur.lastIndexOf("/"));
//       if (hrefSet.has(cur)) return false;
//     }
//     return true;
//   }

//   const filtered = uniq.filter((l) => keepIfNoParentExists(l.href));
//   const verified = (
//     await Promise.all(
//       filtered?.slice(0, 100)?.map(async (link) => {
//         const alive = await isUrlAlive(link.href);
//         return alive ? link : null;
//       })
//     )
//   ).filter(Boolean);

//   const cosineRes = await similar(keyword, verified, 20);

//   saveJson(
//     {
//       root: rootUrl,
//       kept: filtered.length,
//       verifiedTop: verified.length,
//       links: filtered,
//       aliveTop: verified,
//       cosineResults: cosineRes,
//     },
//     "top-level.json"
//   );

//   //   const prompt = `You are an expert web scraper specializing in structured data extraction from websites. Your job is to analyze the provided keyword and extracted URLs and return the 10 most relevant URL according to the provided keyword.

//   //   You are provided with the following URL, keyword, and extracted links:

//   // **URL:** ${url}

//   // **Keyword:** ${keyword}

//   // **Extracted Links:**
//   // ${verified?.map((l) => `[${l?.title}](${l?.href})\n`)}

//   // **Instructions:**

//   // 1.  Identify the 10 URLs that most match the keyword. Consider:

//   //     *   Page Title
//   //     *   Full Absolute URL
//   // 2.  **Exclude** any URLs that are not top-level.
//   // 3.  Verify that the URLs are live and reachable.

//   // **Output Format (Required):**

//   // Present each verified URL in the following format:

//   // "[Page Title](Full URL) brief description of the URL"

//   // **Rules:**

//   // *   Do **not** include any extra content, metadata, headers, footers, or explanatory notes.
//   // *   Only return the verified, live URLs that meet the above criteria.
//   // *   Remove any invalid or unreachable URLs from the final output.`;

//   //   const completion = await client.chat.completions.create({
//   //     model: "gpt-4o-search-preview",
//   //     messages: [
//   //       {
//   //         role: "user",
//   //         content: prompt,
//   //       },
//   //     ],
//   //   });

//   //   console.log(completion.choices[0].message.content);
// })();

//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
//====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================

const {
  RecursiveUrlLoader,
} = require("@langchain/community/document_loaders/web/recursive_url");
const { saveJson, readJson } = require("../common");
const cheerio = require("cheerio");
const { URL } = require("url");
const { similar } = require("../cosine");
require("dotenv").config({ path: "../.env" });
const fetch = require("node-fetch");
const { load } = require("cheerio");

function stripWww(hostname) {
  return hostname
    ?.replace(/^www\./i, "")
    .toLowerCase()
    .replace(/\/+$/, "");
}

function normalizeUrl(href, base) {
  try {
    const url = new URL(href, base);
    if (!/^https?:$/.test(url.protocol)) return null;

    const protocol = url.protocol.toLowerCase();
    const hostname = url.hostname.replace(/^www\./i, "").toLowerCase();
    const pathname = url.pathname.replace(/\/+$/, "");

    return `${protocol}//${hostname}${pathname}`;
  } catch {
    return null;
  }
}

const SOFT_404_PATTERNS = [
  /(^|\b)(404|4 0 4|page\s+not\s+found|sidan\s+hittades\s+inte|not\s+found|no\ssuch\sproduct|we\'re\ssorry)(\b|$)/i,
];

async function isUrlDeepAlive(url, { timeout = 8000 } = {}) {
  try {
    const head = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
      timeout,
    });
    if (head.status >= 400 && head.status !== 405) return false;
  } catch {}

  try {
    const res = await fetch(url, { timeout, redirect: "follow" });
    if (res.status >= 400) return false;
    if (!/^text\/html/i.test(res.headers.get("content-type") || ""))
      return true;

    const html = await res.text();
    if (html.length < 300) return false;
    const $ = load(html);
    const title = $("title").text();
    const h1 = $("h1").first().text();
    const robots = $('meta[name="robots"]').attr("content") || "";
    const haystack = [title, h1, robots].join(" ").replace(/\s+/g, " ");
    if (SOFT_404_PATTERNS.some((re) => re.test(haystack))) return false;
    return true;
  } catch {
    return false;
  }
}

async function isUrlAlive(url, { timeout = 5000 } = {}) {
  try {
    const res = await fetch(url, { method: "HEAD", timeout });
    console.log({ status: res.status, url });
    // const body = await res.text();
    // if (
    //   body.includes("404") ||
    //   body.includes("not found") ||
    //   body.includes("Page Not Found") ||
    //   body.includes("This page does not exist") ||
    //   body.includes("error 404")
    // ) {
    //   return false;
    // }

    if (res.status === 404 || res.status === 410) return false;
    return res.ok || (res.status >= 300 && res.status < 400);
  } catch (err) {
    return true;
  }
}

const test = [
  {
    rootUrl: "https://ticketmaster.se/",
    keyword: "wrestling",
    opt: {
      MAX_DOM_DEPTH: 4,
      maxDepth: 1,
      MAX_TREE_DEPTH: 3,
      MAX_PARENT_DEPTH: 2,
    },
  },
  {
    rootUrl: "https://nike.com/",
    keyword: "sportswear",
    opt: {
      MAX_DOM_DEPTH: 4,
      maxDepth: 1,
      MAX_TREE_DEPTH: 3,
      MAX_PARENT_DEPTH: 2,
    },
  },
  {
    rootUrl: "https://uniqlo.com/us/en/",
    keyword: "clothing",
    opt: {
      MAX_DOM_DEPTH: 4,
      maxDepth: 1,
      MAX_TREE_DEPTH: 3,
      MAX_PARENT_DEPTH: 2,
    },
  },
  {
    rootUrl: "https://indiehackers.com/",
    keyword: "entrepreneurship",
    opt: {
      MAX_DOM_DEPTH: 4,
      maxDepth: 1,
      MAX_TREE_DEPTH: 3,
      MAX_PARENT_DEPTH: 2,
    },
  },
  {
    rootUrl: "https://eu.louisvuitton.com/eng-e1/homepage",
    keyword: "luxury",
    opt: {
      MAX_DOM_DEPTH: 4,
      maxDepth: 1,
      MAX_TREE_DEPTH: 3,
      MAX_PARENT_DEPTH: 2,
    },
  },
  {
    rootUrl: "https://abswheels.se",
    keyword: "wheels",
    opt: {
      MAX_DOM_DEPTH: 4,
      maxDepth: 1,
      MAX_TREE_DEPTH: 3,
      MAX_PARENT_DEPTH: 2,
    },
  },
  {
    rootUrl: "https://apotea.se",
    keyword: "pharmacy",
    opt: {
      MAX_DOM_DEPTH: 4,
      maxDepth: 1,
      MAX_TREE_DEPTH: 3,
      MAX_PARENT_DEPTH: 2,
    },
  },
  {
    rootUrl: "https://elgiganten.se",
    keyword: "electronics",
    opt: {
      MAX_DOM_DEPTH: 4,
      maxDepth: 1,
      MAX_TREE_DEPTH: 3,
      MAX_PARENT_DEPTH: 2,
    },
  },
  {
    rootUrl: "https://proport.se/",
    keyword: "furniture",
    opt: {
      MAX_DOM_DEPTH: 4,
      maxDepth: 1,
      MAX_TREE_DEPTH: 3,
      MAX_PARENT_DEPTH: 2,
    },
  },
  {
    rootUrl: "https://ikea.com/us/en/",
    keyword: "home goods",
    opt: {
      MAX_DOM_DEPTH: 4,
      maxDepth: 1,
      MAX_TREE_DEPTH: 3,
      MAX_PARENT_DEPTH: 2,
    },
  },
  {
    rootUrl: "https://skimming.ai",
    keyword: "AI technology",
    opt: {
      MAX_DOM_DEPTH: 4,
      maxDepth: 1,
      MAX_TREE_DEPTH: 3,
      MAX_PARENT_DEPTH: 2,
    },
  },
  {
    rootUrl: "https://azdesign.se/",
    keyword: "design",
    opt: {
      MAX_DOM_DEPTH: 4,
      maxDepth: 1,
      MAX_TREE_DEPTH: 3,
      MAX_PARENT_DEPTH: 2,
    },
  },
  {
    rootUrl: "https://jula.se/",
    keyword: "hardware",
    opt: {
      MAX_DOM_DEPTH: 4,
      maxDepth: 1,
      MAX_TREE_DEPTH: 3,
      MAX_PARENT_DEPTH: 2,
    },
  },
  {
    rootUrl: "https://nordicnest.se/",
    keyword: "fälgar",
    opt: {
      MAX_DOM_DEPTH: 4,
      maxDepth: 1,
      MAX_TREE_DEPTH: 3,
      MAX_PARENT_DEPTH: 2,
    },
  },
  {
    rootUrl: "https://aurisestetic.se/",
    keyword: "fälgar",
    opt: {
      MAX_DOM_DEPTH: 4,
      maxDepth: 1,
      MAX_TREE_DEPTH: 3,
      MAX_PARENT_DEPTH: 2,
    },
  },
  {
    rootUrl: "https://jonathanfogelberg.com/",
    keyword: "kondition",
    opt: {
      MAX_DOM_DEPTH: 4,
      maxDepth: 1,
      MAX_TREE_DEPTH: 3,
      MAX_PARENT_DEPTH: 2,
    },
  },
];

(async () => {
  async function getTopURLS(
    rootUrl,
    keyword,
    { MAX_DOM_DEPTH, maxDepth, MAX_TREE_DEPTH, MAX_PARENT_DEPTH }
  ) {
    const rootNorm = normalizeUrl(rootUrl);
    console.log({
      MAX_DOM_DEPTH,
      maxDepth,
      MAX_TREE_DEPTH,
      MAX_PARENT_DEPTH,
      rootNorm,
    });
    const docs = await new RecursiveUrlLoader(rootUrl, { maxDepth }).load();
    console.log({ docs: docs.length, rootNorm });
    const linkBag = [];
    for (const doc of docs) {
      const html = doc.pageContent || "";
      const baseUrl = stripWww(
        doc.metadata?.source || doc.metadata?.url || rootUrl
      );
      const $ = cheerio.load(html);

      const selectors = ` nav a, header a,
      [role="navigation"] a, [role="menubar"] a,
      *[class*="nav" i] a, *[class*="menu" i] a,
      *[class*="top-bar" i] a, *[class*="appbar" i] a,
      *[id*="nav" i] a, *[id*="menu" i] a, *[id*="header" i] a`;

      const NAV_ROOTS = `  nav,
  header,
  [role="navigation"],
  [role="menubar"],
  *[class*="nav" i],
  *[class*="menu" i],
  *[class*="top-bar" i],
  *[class*="appbar" i],
  *[id*="nav" i],
  *[id*="menu" i],
  *[id*="header" i]`
        .trim()
        .replace(/\s+/g, " ");

      $(selectors).each((_, el) => {
        let href = $(el).attr("href")?.trim();
        if (!href) return;

        let depth = 0;
        let cur = $(el);

        while (cur.length && !cur.is(NAV_ROOTS)) {
          cur = cur.parent();
          depth++;
        }
        if (depth > MAX_DOM_DEPTH) return;

        if (/^(#|mailto:|tel:|\?|\/\?)/.test(href)) return;

        try {
          const abs = normalizeUrl(href, baseUrl);
          if (abs === rootNorm) return;

          const u = new URL(abs);
          if (!/^https?:$/.test(u.protocol) || u.search || u.hash) return;
          const targetHost = stripWww(u?.hostname);
          const rootHost = stripWww(new URL(rootUrl)?.hostname);

          if (targetHost !== rootHost) return;

          const text = $(el).text().trim().toLowerCase();
          if (
            !text ||
            typeof text !== "string" ||
            text.length < 2 ||
            text.length > 80 ||
            /<\/?[a-z][\s\S]*>/i.test(text) ||
            /^[^\w\d]+$/.test(text) ||
            /\\[nrt]/.test(text) ||
            /{{.*?}}/.test(text) ||
            /[a-zA-Z]{2,}\s{2,}[a-zA-Z]{2,}/.test(text)
          )
            return;

          linkBag.push({ href: abs, title: text });
        } catch {}
      });
    }

    const uniq = Array.from(new Map(linkBag.map((o) => [o.href, o])).values());
    // console.log({ uniq });
    console.log({ uniq: uniq.length });
    const hrefSet = new Set(uniq.map((l) => l.href));

    function keepIfNoParentExists(href) {
      const hrefNorm = href.replace(/\/+$/, "");

      if (!hrefNorm.startsWith(rootNorm)) return true;

      const segments = hrefNorm
        .slice(rootNorm.length)
        .replace(/^\/+/, "")
        .split("/")
        .filter(Boolean);

      let depth = 1;

      for (let i = 0; i < segments.length - 1; i++) {
        const singleURL = `${rootNorm}/${segments[i]}`;
        if (hrefSet.has(singleURL)) depth++;
      }

      return depth <= MAX_TREE_DEPTH;
    }

    const filtered = uniq.filter((l) => keepIfNoParentExists(l.href));
    console.log({ filtered: filtered.length });
    const verified = (
      await Promise.all(
        filtered?.map(async (link) => {
          const alive = await isUrlAlive(link.href /* , { timeout: 5000 } */);
          return alive ? link : null;
        })
      )
    ).filter(Boolean);

    const cosineRes = await similar(keyword, verified, 15);
    // const cosineRes = readJson("similarCosine.json");

    console.log({ cosineRes });
    //==================================
    const hrefSetC = new Set(cosineRes.map((l) => l.href));

    let pseudoParent = null;
    {
      const relPaths = [];
      for (const url of hrefSetC) {
        if (!url.startsWith(rootNorm)) continue; // off-site
        const rel = url
          .slice(rootNorm.length) // trim rootNorm
          .replace(/^\/+/, ""); // trim any leading “/”
        if (rel) relPaths.push(rel.split("/")); // store segments
      }

      if (relPaths.length) {
        let common = relPaths[0];
        for (const segs of relPaths.slice(1)) {
          let i = 0;
          while (i < common.length && i < segs.length && common[i] === segs[i])
            i++;
          common = common.slice(0, i); // keep only the common part
          if (!common.length) break; // bail early if nothing matches
        }

        if (common.length) {
          const candidate = common.join("/"); // e.g. "sv/en" or "sv/en/ar"
          if (!hrefSetC.has(`${rootNorm}/${candidate}`)) {
            pseudoParent = candidate;
          }
        }
      }
    }
    function getFirstThreeWords(str) {
      const words = str.split(" ");
      return words.slice(0, 3).join(" ");
    }
    function isOnlyNumbers(str) {
      return /^[0-9]+$/.test(str);
    }
    console.log({ pseudoParent });
    async function keepParents({ href, title, distance }) {
      const trimTitle = getFirstThreeWords(title);
      const hrefNorm = href.replace(/\/+$/, ""); // trim trailing “/”
      if (!hrefNorm.startsWith(rootNorm))
        return { href, title: trimTitle, distance }; // off-domain → keep

      let segments = hrefNorm
        .slice(rootNorm.length)
        .replace(/^\/+/, "")
        .split("/")
        .filter(
          (v) => !pseudoParent?.replace(/^\/+/, "")?.split("/")?.includes(v)
        )
        .filter(Boolean);
      let depth = 0;
      for (let i = 0; i <= segments.length; i++) {
        const singleURL = `${rootNorm}${
          pseudoParent ? `/${pseudoParent}` : ``
        }/${segments.slice(0, i).join("/")}`;

        const isalive = await isUrlDeepAlive(
          singleURL /* , { timeout: 8000 } */
        );
        console.log({ isalive });
        if (isalive) {
          if (depth == MAX_PARENT_DEPTH) {
            console.log({ singleURL, depth });
            return {
              href: singleURL,
              title: isOnlyNumbers(segments[i - 1])
                ? trimTitle
                : segments[i - 1]?.replace(/-/g, " ") || trimTitle,
              distance,
            };
          }
          depth++;
        }
      }
      if (depth > MAX_PARENT_DEPTH) {
        return null;
      }
      return { href, title: trimTitle, distance };
    }

    const batchSize = 100;
    let acc = [];

    for (let i = 0; i < cosineRes.length; i += batchSize) {
      const batch = cosineRes.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map((link) => keepParents(link))
      );
      acc.push(...batchResults);
    }

    // const uniqAcc = Array.from(
    //   acc?.filter((l) => l)
    //     .sort((a, b) => b.distance - a.distance)
    //     .reduce((map, item) => map.set(item.href, item), new Map())
    //     .values()
    // )

    const uniqAcc = Array.from(
      new Map(acc?.filter((l) => l).map((o) => [o.href, o])).values()
    );

    const hrefParent = new Set(uniqAcc.map((l) => l.href));
    function keepTheParent(href) {
      let cur = href.replace(/\/+$/, "");
      while (cur.startsWith(rootNorm) && cur.length > rootNorm.length) {
        cur = cur.slice(0, cur.lastIndexOf("/"));
        if (hrefParent.has(cur)) return false;
      }
      return true;
    }

    const linksData = uniqAcc.filter((l) => keepTheParent(l.href));
    saveJson(
      {
        root: rootUrl,
        length: {
          links: filtered?.length,
          aliveTop: verified?.length,
          cosineResults: cosineRes?.length,
          parents: acc?.length,
          uniqAcc: uniqAcc?.length,
          linksData: linksData?.length,
        },
        links: filtered,
        aliveTop: verified,
        cosineResults: cosineRes,
        parents: acc,
        uniqAcc,
        linksData,
      },
      `${keyword}-top-level.json`,
      "top-level-url"
    );
  }

  await Promise.all(
    test?.map(
      async (data) => await getTopURLS(data.rootUrl, data.keyword, data.opt)
    )
  );
})();
