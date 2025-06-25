const { getJson } = require("serpapi");
const { saveJson } = require("./common");

const key = "8ced4b61e22aab905e1e5103ed841dac25c55b76b30924be399d9695cacfebb0";
// 84e5b62fe1ea67fb93874b3bc39b41016132fdd8df5ab02295f00e8fc7d67811
getJson(
  {
    engine: "youtube",
    search_query: "träd",
    gl: "ch", // Switzerland
    hl: "sv", // Swedish
    api_key: key,
  },
  (json) => {
    saveJson(json, "serp.json");
  }
);
