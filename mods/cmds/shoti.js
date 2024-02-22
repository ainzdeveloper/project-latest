module.exports.config = {
  name: "shoti",
  version: "1.0.0",
  credits: "Ainz",
  description: "Generate random tiktok girl videos",
  hasPermssion: 0,
  commandCategory: "other",
  usage: "[shoti]",
  cooldowns: 5,
  dependencies: [],
  usePrefix: false
};

module.exports.run = async function({ api, event }) {
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Manila").format("DD/MM/YYYY || HH:mm:s");
  const axios = require("axios");
  const request = require('request');
  const fs = require("fs")
  let response = await axios.post('https://your-shoti-api.vercel.app/api/v1/get', { apikey: "shoti-1hgn30msgapp542i0qg" });
    const userInfo = response.data.data.user;
    const videoInfo = response.data.data;
    const title = videoInfo.title;
    const durations = videoInfo.duration;
    const region = videoInfo.region;
    const username = userInfo.username;
    const nickname = userInfo.nickname;
  var file = fs.createWriteStream(__dirname + "/cache/shoti.mp4");
  var rqs = request(encodeURI(response.data.data.url));
  rqs.pipe(file);
  file.on('finish', () => {
    return api.sendMessage({
      body: `✨𝙷𝚎𝚛𝚎\'𝚜 𝚢𝚘𝚞𝚛 𝚜𝚑𝚘𝚝𝚒!\n\n𝚃𝚒𝚝𝚕𝚎: ${title}\n𝙽𝚒𝚌𝚔𝚗𝚊𝚖𝚎: ${nickname}\n𝚄𝚜𝚎𝚛𝚗𝚊𝚖𝚎: ${username}\n𝙳𝚞𝚛𝚊𝚝𝚒𝚘𝚗𝚜: ${durations}\n𝙳𝚊𝚝𝚎 𝚊𝚗𝚍 𝚃𝚒𝚖𝚎: ${time}`, 
      attachment: fs.createReadStream(__dirname + '/cache/shoti.mp4')
    }, event.threadID, event.messageID)
  })
  file.on('error', (err) => {
      api.sendMessage(`Shoti Error: ${err}`, event.threadID, event.messageID);
  })
};