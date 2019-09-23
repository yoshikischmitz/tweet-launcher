// downlaods tweets in reverse chronological order
// id of oldest downloaded tweet so far is stored in 'oldest_downloaded'

const sleepTime = 2000;

const Twit = require("twit");

const T = new Twit({
  consumer_key: "...",
  consumer_secret: "...",
  access_token: "...",
  access_token_secret: "...",
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true // optional - requires SSL certificates to be valid.
});

// strategy:
// store id of last tweet we consumed in "memo"
// store each file in the format:
// [tweetid].json

const getTweets = maxId => {
  T.get(
    "statuses/user_timeline",
    {
      tweet_mode: "extended",
      trim_user: true,
      include_rts: false,
      max_id: maxId
    },
    function(err, data, response) {
      data.forEach(writeTweet);
      console.log("wrote", data.length, "tweets");
      const { id_str: lastId } = data[data.length - 1];
      write("oldest_tweet_id", lastId);

      if (lastId === maxId) {
        return;
      }

      setTimeout(() => getTweets(lastId), sleepTime);
    }
  );
};

let maxId;
try {
  maxId = read("oldest_tweet_id");
} catch {
  console.log("didn't find oldest_downloaded");
}
getTweets(maxId);
