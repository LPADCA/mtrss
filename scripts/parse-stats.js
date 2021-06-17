const fs = require("fs");
const parser = require("node-html-parser");

function generateStats() {
  const statsHTML = fs.readFileSync("./stats.html");

  const statsDOM = parser.parse(statsHTML);

  const statsDiv = statsDOM.querySelector('[data-testid="audience-where-they-listen"]');

  const statsTable = statsDiv.querySelectorAll("tbody tr");

  const trimString = str => str.replace(/\s{1,}/g, " ").trim();
  const toNumber = str => eval(str.replace("k", "* 1000"));

  const json = [...statsTable].map(tr => {
    const tableCells = [...tr.childNodes].filter(element => {
      return element.tagName === "TD";
    });
    return {
      country: trimString(tableCells[1].innerText),
      value: toNumber(trimString(tableCells[2].innerText)),
    };
  });

  return json;
}

function saveStats(json) {
  fs.writeFileSync("./src/assets/stats.json", JSON.stringify(json));
}

module.exports = function () {
  const json = generateStats();
  saveStats(json);
};
