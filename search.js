const { write, read, readDir } = require("./core");
const { uniq } = require("lodash");
const fs = require("fs");
const FlexSearch = require("flexsearch");
const inquirer = require("inquirer");
const open = require("open");

const index = new FlexSearch({ async: true });

const mUrl = "https://twitter.com/yoshikischmitz/status/";

let tweets = {};

uniq(readDir())
  .filter(f => f.endsWith(".json"))
  .forEach(f => {
    const t = JSON.parse(read(f));
    const { id_str: id, full_text } = t;
    index.add(id, full_text);
    const url = mUrl + id + "/";
    tweets[id] = { full_text, url };
  });

const search = query => {
  return new Promise(resolve => {
    index.search(query).then(results => {
      const fullResults = results.map(id => {
        const { url, full_text } = tweets[id];
        return { name: full_text, value: url };
      });
      resolve(fullResults);
    });
  });
};

inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

const prompt = () =>
  inquirer
    .prompt([
      {
        type: "autocomplete",
        name: "tweet",
        message: "Search your tweets",
        pageSize: 50,
        source: function(answersSoFar, input) {
          return search(input);
        }
      }
    ])
    .then(function({ tweet }) {
      open(tweet);
      prompt();
    });

prompt();
