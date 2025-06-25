const { OpenAIEmbeddings } = require("@langchain/openai");
require("dotenv").config({ path: ".env" });

function normalizeText(str) {
  return str
    .toLowerCase()
    .replace(/&/g, "och")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(str) {
  const norm = normalizeText(str);
  if (norm === "") return 0;
  return norm.split(" ").length;
}

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

async function keywordEmbedding(keyword) {
  const model = new OpenAIEmbeddings({
    apiKey: process.env.API_KEY_OPENAI,
    modelName: "text-embedding-3-large",
  });
  return model.embedQuery(keyword);
}

function slidingWindows(text, wordsPerWindow = 3, overlapWords = 1) {
  const tokens = text.split(/\s+/);
  const windows = [];
  for (
    let start = 0;
    start < tokens.length;
    start += wordsPerWindow - overlapWords
  ) {
    windows.push(tokens.slice(start, start + wordsPerWindow).join(" "));
    if (start + wordsPerWindow >= tokens.length) break;
  }
  return windows;
}

async function isKeywordInSegment(rawKeyword, rawSegment) {
  const normKW = normalizeText(rawKeyword);
  const normSeg = normalizeText(rawSegment);
  const numWordsInKeyword = countWords(rawKeyword);

  if (normSeg.includes(normKW)) {
    return { found: true, method: "substring" };
  }

  const kwEmb = await keywordEmbedding(normKW);
  const windows = slidingWindows(rawSegment, numWordsInKeyword, 1);

  const embeddingModel = new OpenAIEmbeddings({
    apiKey: process.env.API_KEY_OPENAI,
    modelName: "text-embedding-3-large",
  });

  for (let w of windows) {
    const winEmb = await embeddingModel.embedQuery(w);
    const sim = cosineSimilarity(kwEmb, winEmb);
    if (sim >= 0.6) {
      return { found: true, method: "embedding", similarity: sim };
    }
  }

  return { found: false, method: "none" };
}

// Example usage:
(async () => {
  const keyword = "Kök & matsal";

  const h1Text = "som hjärta i offentliga miljöer Kök och matsal ";
  const bodyText =
    "är mycket mer än platser där mat tillagas och serveras. " +
    "I restauranger, hotell, skolor, företag och andra offentliga verksamheter " +
    "fungerar dessa ytor som samlingspunkter, nav för samtal och atmosfärbyggare. " +
    "Att skapa kök och matsal som stödjer och förstärker verksamhetens syfte är en process där ..." +
    " (remainder of text)";
  const first100 = bodyText.split(/\s+/).slice(0, 100).join(" ");
  const metaDescription =
    "Inredning för med funktionell planering och hållbara material. " +
    "Skapa gästvänliga miljöer – boka gratis konsultation med  Kök & Matsal AZ Design.";

  const checkH1 = await isKeywordInSegment(keyword, h1Text);
  console.log("H1 match?", checkH1);

  const checkFirst100 = await isKeywordInSegment(keyword, first100);
  console.log("First 100 words match?", checkFirst100);

  const checkMeta = await isKeywordInSegment(keyword, metaDescription);
  console.log("MetaDescription match?", checkMeta);
})();
