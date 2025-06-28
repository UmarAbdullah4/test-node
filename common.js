const fs = require("fs");
const path = require("path");

function saveJson(data, filename = "output.json", folder = "") {
  const filePath = path.join(__dirname, folder, filename);
  const jsonString = JSON.stringify(data, null, 2);

  fs.writeFile(filePath, jsonString, (err) => {
    if (err) {
      console.error("Failed to save JSON:", err);
    } else {
      console.log(`JSON saved to ${filename}`);
    }
  });
}

function readJson(filename = "output.json") {
  const filePath = path.join(__dirname, filename);
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (err) {
    console.error("Failed to read JSON:", err);
    return null;
  }
}

module.exports = { saveJson, readJson };
