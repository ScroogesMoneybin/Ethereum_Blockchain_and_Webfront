const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const compiledPath = path.resolve(__dirname, "compiled");
fs.removeSync(compiledPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");
const input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};
 
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Campaign.sol"
];

fs.ensureDirSync(compiledPath);

for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(compiledPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}
