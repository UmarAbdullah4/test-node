const axios = require("axios");
const crypto = require("crypto");
const fs = require("fs");
const metaFilePath = "./siteMeta.json"; // Persisted metadata file

function computeHash(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

async function checkSiteModified(url, meta = {}, saveMeta) {
  try {
    console.log("Sending HEAD request...");
    const headRes = await axios.head(url);
    const lastModified = headRes.headers["last-modified"];
    const etag = headRes.headers["etag"];

    if ((lastModified || etag) && (meta.lastModified || meta.etag)) {
      if (
        (lastModified && lastModified !== meta.lastModified) ||
        (etag && etag !== meta.etag)
      ) {
        meta.lastModified = lastModified;
        meta.etag = etag;
        saveMeta(meta);
        return { modified: true, method: "HEAD headers", meta };
      }
      return { modified: false, method: "HEAD headers", meta };
    }

    if (lastModified || etag) {
      meta.lastModified = lastModified;
      meta.etag = etag;
      saveMeta(meta);
    }
  } catch (err) {
    console.error("HEAD request failed:", err.message);
  }

  try {
    const getHeaders = {};
    if (meta.lastModified) getHeaders["If-Modified-Since"] = meta.lastModified;
    if (meta.etag) getHeaders["If-None-Match"] = meta.etag;

    console.log("Sending conditional GET request...");
    const getRes = await axios.get(url, {
      headers: getHeaders,
      validateStatus: null,
    });
    if (getRes.status === 304) {
      return { modified: false, method: "Conditional GET (304)", meta };
    } else if (getRes.status === 200) {
      const newLastModified = getRes.headers["last-modified"];
      const newEtag = getRes.headers["etag"];
      let headerChange = false;
      if (newLastModified && newLastModified !== meta.lastModified) {
        meta.lastModified = newLastModified;
        headerChange = true;
      }
      if (newEtag && newEtag !== meta.etag) {
        meta.etag = newEtag;
        headerChange = true;
      }
      if (headerChange) {
        saveMeta(meta);
        return {
          modified: true,
          method: "Conditional GET (header change)",
          meta,
        };
      }
      console.log("No header change, proceeding with hash check...");
      const pageContent = getRes.data;
      const currentHash = computeHash(pageContent);
      if (!meta.hash) {
        meta.hash = currentHash;
        saveMeta(meta);
        return { modified: false, method: "Hash init", meta };
      } else if (currentHash !== meta.hash) {
        meta.hash = currentHash;
        saveMeta(meta);
        return { modified: true, method: "Content hash", meta };
      } else {
        return { modified: false, method: "Content hash", meta };
      }
    }
  } catch (err) {
    console.error("Conditional GET request failed:", err.message);
  }

  try {
    console.log("Sending full GET request for hash check...");
    const res = await axios.get(url);
    const pageContent = res.data;
    const currentHash = computeHash(pageContent);

    if (!meta.hash) {
      meta.hash = currentHash;
      saveMeta(meta);
      return { modified: false, method: "Hash init", meta };
    } else if (currentHash !== meta.hash) {
      meta.hash = currentHash;
      saveMeta(meta);
      return { modified: true, method: "Content hash", meta };
    } else {
      return { modified: false, method: "Content hash", meta };
    }
  } catch (err) {
    console.error("Full GET request failed:", err.message);
    throw err;
  }
}

// Example usage:
(async () => {
  const url = "https://1337x.to/"; // Replace with your target URL

  function loadMeta() {
    if (fs.existsSync(metaFilePath)) {
      return JSON.parse(fs.readFileSync(metaFilePath, "utf-8"));
    }
    return {};
  }

  function saveMeta(meta) {
    console.log({ meta });
    fs.writeFileSync(metaFilePath, JSON.stringify(meta, null, 2));
  }

  const storedMeta = loadMeta();
  try {
    const result = await checkSiteModified(url, storedMeta, saveMeta);
    console.log({ result });
    console.log(`Modified: ${result.modified} (via ${result.method})`);
  } catch (err) {
    console.error("Error checking if site modified:", err);
  }
})();
