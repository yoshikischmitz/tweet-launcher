const dir = "./data/api-dump/";
const fs = require("fs");

const write = (f, str) => fs.writeFileSync(dir + f, str);
const read = f => fs.readFileSync(dir + f, "utf8");

const writeTweet = tweet => {
  write(tweet.id_str + ".json", JSON.stringify(tweet));
};

const readDir = () => fs.readdirSync(dir);

module.exports = { write, read, readDir };
