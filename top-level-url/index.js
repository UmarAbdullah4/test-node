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
const { saveJson } = require("../common");
const cheerio = require("cheerio");
const { URL } = require("url");
const { similar } = require("../cosine");
require("dotenv").config({ path: "../.env" });

// const rootUrl = "https://www.nike.com/";
// const rootUrl = "https://www.uniqlo.com/us/en/";
// const rootUrl = "https://indiehackers.com/";
// const rootUrl = "https://eu.louisvuitton.com/eng-e1/homepage";
// const rootUrl = "https://abswheels.se";
// const rootUrl = "https://apotea.se";
const rootUrl = "https://elgiganten.se";
// const rootUrl = "https://proport.se/";
// const rootUrl = "https://www.ikea.com/us/en/";
// const rootUrl = "https://skimming.ai";
// const rootUrl = "https://www.azdesign.se/";

const keyword = "Kompletta hjul";

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

async function isUrlAlive(url) {
  try {
    const res = await fetch(url, { method: "HEAD", timeout: 5000 });
    console.log({ status: res.status, url });
    if (res.status === 404 || res.status === 410) return false;
    return res.ok || (res.status >= 300 && res.status < 400);
  } catch (err) {
    return true;
  }
}

const rootNorm = stripWww(rootUrl.replace(/\/+$/, ""));

const TUNE = {
  // --- 1. DOM depth tuning ----------------------------------------
  domSampleSel: `
    nav a, header a, [role="navigation"] a, [role="menubar"] a,
    *[class*="nav" i] a, *[class*="menu" i] a,
    *[id*="nav" i] a,  *[id*="menu" i] a
  `,
  keepPct: 0.9, // capture this fraction of anchors
  domDepthCap: 8, // never allow > 8 (safety)

  // --- 2. Hop-depth tuning ----------------------------------------
  hopMaxCap: 3, // never crawl further than this
  hopStopGain: 0.15, // stop when newLinks / prevLinks < 15 %
  hopLinkFloor: 10, // but always crawl until we have ≥ 10 links
};

async function tuneSite(rootUrl) {
  const rootHtml = await (await fetch(rootUrl)).text();
  const $ = cheerio.load(rootHtml);

  /* ---------- 1. DOM-depth distribution ---------- */
  const depthHist = {};
  $(TUNE.domSampleSel).each((_, a) => {
    let d = 0,
      cur = $(a);
    while (
      cur.length &&
      !cur.is(
        'nav, header, [role="navigation"], [role="menubar"], *[class*="nav" i], *[class*="menu" i], *[id*="nav" i], *[id*="menu" i]'
      )
    ) {
      cur = cur.parent();
      d++;
    }
    depthHist[d] = (depthHist[d] || 0) + 1;
  });

  const totalAnchors = Object.values(depthHist).reduce((s, n) => s + n, 0);
  let cum = 0,
    maxDomDepth = 0;
  for (let d = 0; d <= TUNE.domDepthCap; d++) {
    cum += depthHist[d] || 0;
    if (cum / totalAnchors >= TUNE.keepPct) {
      maxDomDepth = d;
      break;
    }
  }

  /* ---------- 2. Hop-depth estimation ---------- */
  const seen = new Set([rootUrl]);
  let layer = new Set([rootUrl]);
  let nextHopDepth = 0;

  while (nextHopDepth < TUNE.hopMaxCap) {
    const newLayer = new Set();

    // fetch all pages in current layer (HEAD only – cheap)
    await Promise.all(
      [...layer].map(async (url) => {
        try {
          const html = await (await fetch(url)).text();
          const $$ = cheerio.load(html);
          $$("a[href]").each((_, a) => {
            try {
              const abs = new URL($$(a).attr("href"), url).href;
              if (!seen.has(abs) && abs.startsWith(rootUrl)) {
                seen.add(abs);
                newLayer.add(abs);
              }
            } catch {}
          });
        } catch {}
      })
    );

    const gain = newLayer.size / (layer.size || 1);
    if (seen.size >= TUNE.hopLinkFloor && gain < TUNE.hopStopGain) break;

    layer = newLayer;
    if (!layer.size) break;
    nextHopDepth += 1;
  }

  return { maxDomDepth, maxHopDepth: nextHopDepth };
}

(async () => {
  // const { maxDomDepth: MAX_DOM_DEPTH, maxHopDepth: maxDepth } = await tuneSite(
  //   rootUrl
  // );

  // const prompt = `You are an expert information-architect and SEO crawler-tuner.

  //     Root domain: ${rootUrl}

  //     Given a root domain, you must decide two integers:

  //     • maxDepth      – fewest link-hops needed to discover ALL major
  //                       navigation sections. 0 = root only.
  //     • maxDomDepth  – deepest DOM nesting level that still captures ≥ 90 %
  //                       of navigation anchors when selecting with the CSS
  //                      pattern provided by the user.

  //     Rules:
  //     1. Return the *smallest* numbers that satisfy the 90 % coverage rule.
  //     2. Hard limits: 0 ≤ maxDepth ≤ 5, 0 ≤ maxDomDepth ≤ 8.
  //     3. Respond **only** by calling the function set_crawl_params – no prose.
  //     4. Think step-by-step *internally* but never reveal the chain of thought.`;

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

  const MAX_DOM_DEPTH = 4;
  const maxDepth = 1;

  const docs = await new RecursiveUrlLoader(rootUrl, { maxDepth }).load();
  console.log({ docs: docs.length });
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

  const hrefSet = new Set(uniq.map((l) => l.href));

  function keepIfNoParentExists(href) {
    let cur = href.replace(/\/+$/, "");
    while (cur.startsWith(rootNorm) && cur.length > rootNorm.length) {
      cur = cur.slice(0, cur.lastIndexOf("/"));
      if (hrefSet.has(cur)) return false;
    }
    return true;
  }

  const filtered = uniq.filter((l) => keepIfNoParentExists(l.href));
  const verified = (
    await Promise.all(
      filtered?.slice(0, 100)?.map(async (link) => {
        const alive = await isUrlAlive(link.href);
        return alive ? link : null;
      })
    )
  ).filter(Boolean);

  const cosineRes = await similar(keyword, verified, 20);

  saveJson(
    {
      root: rootUrl,
      kept: filtered.length,
      verifiedTop: verified.length,
      links: filtered,
      aliveTop: verified,
      cosineResults: cosineRes,
    },
    "top-level.json"
  );
})();
