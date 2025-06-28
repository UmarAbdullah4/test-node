// const cosineSimilarityLib = require("compute-cosine-similarity");
// const { OpenAIEmbeddings } = require("@langchain/openai");

// const cosine = async (doc1, doc2) => {
//   const embeddings = new OpenAIEmbeddings({
//     // apiKey: process.env.OPENAI_KEY,
//     apiKey: "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",
//     modelName: "text-embedding-3-large",
//   });
//   const e1 = await embeddings.embedQuery(doc1);
//   const e2 = await embeddings.embedQuery(doc2);
//   return cosineSimilarityLib(e1, e2);
// };

// const findMostRelevant = async (doc1, items, val, toReturn) => {
//   const scoredItems = [];

//   let highestScore = -1;
//   let mostRelevant = null;

//   for (const item of items) {
//     const similarityScore = await cosine(doc1 ?? "", item?.[val] ?? "");
//     console.log({ similarityScore, doc: doc1, item: item?.[val] });

//     if (toReturn) {
//       scoredItems.push({ ...item, similarityScore });
//     } else {
//       if (similarityScore > highestScore) {
//         highestScore = similarityScore;
//         mostRelevant = { ...item, similarityScore };
//       }
//     }
//   }

//   if (toReturn) {
//     scoredItems.sort((a, b) => b.similarityScore - a.similarityScore);
//     return scoredItems.slice(0, toReturn);
//   } else {
//     return mostRelevant;
//   }
// };

// module.exports = { findMostRelevant, cosine };

const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { readJson, saveJson } = require("./common");
require("dotenv").config({ path: ".env" });

function convertArray(inputArray) {
  const titles = inputArray.map((item) => item.title);
  const hrefs = inputArray.map((item) => ({ href: item.href }));

  return [titles, hrefs];
}
const similar = async (keyword, allUrls, max) => {
  // const allUrls = readJson("linksCount.json");
  // const urls = allUrls?.filter((f) => f?.count = 2);
  // const urls = allUrls?.slice(0, 50);
  // const keyword = "";

  const urls = allUrls;
  const embeddingsModel = new OpenAIEmbeddings({
    apiKey: process.env.API_KEY_OPENAI,
    modelName: "text-embedding-3-large",
  });
  const vectorStore = await MemoryVectorStore.fromTexts(
    ...convertArray(urls),
    embeddingsModel
  );
  const queryEmbedding = await embeddingsModel.embedQuery(keyword);
  const resultOne = await vectorStore.similaritySearchVectorWithScore(
    queryEmbedding,
    max || 5
  );

  const results = resultOne.map(([doc, distance]) => {
    return {
      title: doc.pageContent,
      href: doc.metadata.href,
      distance: distance,
    };
  });
  console.log({ results });

  saveJson(results, "similarCosine.json");
  return results;
  // const arr = [];

  // for (let i = 0; i < urls?.length; i++) {
  //   const company = [];
  //   for (let ci = 0; ci < urls[i]?.length; ci++) {
  //     const resultOne = await vectorStore.similaritySearch(
  //       urls[i][ci]?.summary ?? "",
  //       1
  //     );
  //     console.log(
  //       urls[i][ci]?.title,
  //       ":",
  //       resultOne[0]?.metadata?.href
  //     );
  //     company.push({
  //       company: urls[i][ci]?.title,
  //       subtitle: urls[i][ci]?.subtitle,
  //       href: resultOne[0]?.metadata?.href,
  //       description: urls[i][ci]?.summary,
  //     });
  //   }
  //   arr.push(company);
  // }

  // return arr;
};

module.exports = { similar };

// const { MemoryVectorStore } = require("langchain/vectorstores/memory");
// const { OpenAIEmbeddings } = require("@langchain/openai");

// async function buildVectorStore(items, embeddings) {
//   const texts = items.map(({ title }) => title);
//   const metadatas = items.map(({ href }) => ({ href }));
//   return MemoryVectorStore.fromTexts(texts, metadatas, embeddings);
// }

// async function similar(keyword, allUrls, opts = {}) {
//   const { topK = 5, minScore = 0.8 } = opts;
//   const embeddings = new OpenAIEmbeddings({
//     apiKey: process.env.API_KEY_OPENAI,
//     modelName: "text-embedding-3-large",
//   });

//   const vectorStore = await buildVectorStore(allUrls, embeddings);

//   const queryEmbedding = await embeddings.embedQuery(keyword);
//   const raw = await vectorStore.similaritySearchVectorWithScore(
//     queryEmbedding,
//     topK * 2
//   );

//   const strictHits = raw
//     // .filter(([_, score]) => score >= minScore)
//     // .slice(0, topK) // keep the best K
//     .map(([doc, score]) => ({
//       title: doc.pageContent,
//       href: doc.metadata.href,
//       score,
//     }));

//   return strictHits;
// }

// module.exports = { similar };
