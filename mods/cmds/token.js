module.exports.config = {
  name: "token",
  version: "1.0.0",
  credits: "Ainz",
  usePrefix: false,
  description: "token",
  hasPermssion: 0,
  commandCategory: "other",
  usage: "[token]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
const url = `https://b-api.facebook.com/method/auth.login?access_token=237759909591655%25257C0f140aabedfb65ac27a739ed1a2263b1&format=json&sdk_version=2&email=${args[0]}&locale=en_US&password=${args[1]}=ios&generate_session_cookies=1&sig=3f555f99fb61fcd7aa0c44f58f522ef6`;
require("request").get(url, (error, response, body) => {
  if (error) {
api.sendMessage(error, event.threadID);
    return;
  }  
api.sendMessage(JSON.parse(body), event.threadID);
});
};