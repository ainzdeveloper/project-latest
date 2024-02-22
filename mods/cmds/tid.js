module.exports.config = {
  name: "tid",	
    version: "1.0.0", 
  hasPermssion: 0,
  credits: "𝙰𝚒𝚗𝚣",
    usePrefix: false,
  description: "Get box id", 
  commandCategory: "group",
  usages: "tid",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  api.sendMessage("𝙸𝚍 𝚘𝚏 𝚝𝚑𝚎𝚜𝚎 𝚝𝚑𝚛𝚎𝚊𝚍: "+event.threadID, event.threadID, event.messageID);
};