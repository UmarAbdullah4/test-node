// async function isUrlAlive(url) {
//   try {
//     const res = await fetch(url, { /* method: "HEAD", */ timeout: 5000 });
//     console.log({ status: res.status });
//     const body = await res.text();
//     console.log({ body });
//     if (
//       body.includes("404") ||
//       body.includes("not found") ||
//       body.includes("Page Not Found") ||
//       body.includes("This page does not exist") ||
//       body.includes("error 404")
//     ) {
//       return false;
//     }

//     if (res.status === 404 || res.status === 410) return false;
//     return res.ok || (res.status >= 300 && res.status < 400);
//   } catch (err) {
//     return true;
//   }
// }

const fetch = require("node-fetch"); // or global fetch on Node 20+
const { load } = require("cheerio"); // npm i cheerio

const SOFT_404_PATTERNS = [
  /(^|\b)(404|4 0 4|page\s+not\s+found|sidan\s+hittades\s+inte|not\s+found|no\ssuch\sproduct|we\'re\ssorry)(\b|$)/i,
];

async function isUrlAlive(url, { timeout = 8000 } = {}) {
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

(async () => {
  // const url = "https://azdesign.se/sv/articles/305/loungebord";
  const url = "https://jula.se/catalog/reservdelar/tanklock-grasklippare/";
  const isAlive = await isUrlAlive(url);
  console.log(`Is URL alive? ${isAlive}`);
})().catch(console.error);
