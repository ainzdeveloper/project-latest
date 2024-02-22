const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "goibot1",
  version: "1.0.4",
  hasPermssion: 0,
  credits: "Ainz",
  usePrefix: true,
  description: "goibot",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5
};
module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  var { threadID, messageID, reason } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Manila").format("HH:MM:ss L");
  var idgr = `${event.threadID}`;
  var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);
  var tl = ["Can u interact with my admin/owner(Berwin)", "Wag kana malungkot nandito naman ako.", " Andito nako mahal.", "Hello love😚", "Honeyy🥰", "Yes lovee?", "I Love You😘", "Oyy bakit pare?", "Don't spam me please uwu.","hello, I'm ber's bot", "What do you call me??", "i love you Kyrin Wu", "Love you >3", "Hi, hello baby wife:3", "What's wrong with the wife calling??", "Use callad to communicate with admin!", "You are the cutest bot on the planet", "What are you saying pig", "It's me~~~~", "Love you BLACK the most", "he's ADMIN's bae", "Love admin the most", "He is admin's backend", "What's up princess?", "Don't make me sad ~~~", "Play word reading with me ah ah ah", "Recruiting pilots", "Being a superhero? very happy", "Are you lonely??", "Set rela is not too rushed!!!", "It's okay :)))", "I do like my master", "Don't praise me for being too shy" ,"Will you be my wife? ?", "Don't spam me :<<, I'm so tired", "bla bla", "Don't push him hard!!!", "Just hit tutu, it hurts :'(", "Loving you is like a torture\click up and down let's play together", "Spam cc fuck", "Do you love me?", "Your wife is here", "Admin likes Gura, how about you?", "I like you too <3", "how are you?", "have you already take a breakfast?", "It's nice to see you", "don't be sad, I'm still here", "ughh, noo not there. plss", "never gonna give you up", "pls pm me"];
  var rand = tl[Math.floor(Math.random() * tl.length)];
  var tl1 = ["Yes i'm gay.", "I'm gayy", "I love being gay."];
  var rand1 = tl1[Math.floor(Math.random() * tl1.length)];
  var tl2 = [`Yes I am ${global.config.BOTNAME}`, "Why??"];
  var rand2 = tl2[Math.floor(Math.random() * tl2.length)];
  if ((event.body.toLowerCase() == "good night") || (event.body.toLowerCase() == "gn")) {
     return api.sendMessage("️Good Night too mahal Sleepwell!💗", threadID, messageID);
   };

   if ((event.body.toLowerCase() == "good morning") || (event.body.toLowerCase() == "gm")) {
     return api.sendMessage("Good Morning too mahal 💗 Kape tayo?", threadID, messageID);
   };


   if ((event.body.toLowerCase() == "mahal") || (event.body.toLowerCase() == "love")) {
     return api.sendMessage("Why babe??", threadID, messageID);
   };


   if ((event.body.toLowerCase() == "prefix") || (event.body.toLowerCase() == "pre")) {
     return api.sendMessage("「 "+global.config.BOTNAME+" Bot 」\n Prefix: » "+global.config.PREFIX+" «\nUse「 "+global.config.PREFIX+"help 」to show all bot commands.", threadID, messageID);
   };


   if ((event.body.toLowerCase() == "pogi") || (event.body.toLowerCase() == "gwapo")) {
     return api.sendMessage("Sigi na                                       ~𝙔𝙤𝙪'𝙧𝙚 𝙖𝙡𝙬𝙖𝙮𝙨 𝙤𝙣 𝙢𝙮 𝙢𝙞𝙣𝙙           𝙏𝙝𝙖𝙩'𝙨 𝙝𝙤𝙬 𝙢𝙪𝙘𝙝 𝙄 𝙘𝙖𝙧𝙚                   𝙄 𝙘𝙖𝙣'𝙩 𝙩𝙝𝙞𝙣𝙠 𝙤𝙛 𝙖 𝙩𝙞𝙢𝙚                     𝙏𝙝𝙖𝙩 𝙮𝙤𝙪 𝙬𝙚𝙧𝙚𝙣'𝙩 𝙩𝙝𝙚𝙧𝙚                      𝙄 𝙠𝙣𝙤𝙬 𝙩𝙝𝙖𝙩 𝙄'𝙙 𝙗𝙚 𝙡𝙮𝙞𝙣𝙜 𝙞𝙛               𝙄 𝘿𝙞𝙙𝙣'𝙩 𝙬𝙖𝙣𝙩 𝙮𝙤𝙪 𝙝𝙚𝙧𝙚                  𝘾𝙖𝙪𝙨𝙚 𝙗𝙖𝙗𝙮 𝙄'𝙢 𝙞𝙣 𝙡𝙤𝙫𝙚 𝘼𝙣𝙙 𝙬𝙝𝙮 𝙘𝙖𝙣'𝙩 𝙮𝙤𝙪 𝙟𝙪𝙨𝙩 𝙡𝙞𝙫𝙚 𝙣𝙚𝙖𝙧~", threadID, messageID);
   };

   if ((event.body.toLowerCase() == "ha") || (event.body.toLowerCase() == "haa")) {
     return api.sendMessage("Ha-- hatdog cheesedog tatay mo sabog.", threadID, messageID);
   }

if ((event.body.toLowerCase() == "oki")) {
     return api.sendMessage("Okilang", threadID, messageID);
   };

   if ((event.body.toLowerCase() == "Berwin")) {
     return api.sendMessage("Pogi yan, crush ko yan ih.", threadID, messageID);
   };

   if ((event.body.toLowerCase() == "nigga")) {
     return api.sendMessage("racist amp0ta!", threadID, messageID);
   };


   if ((event.body.toLowerCase() == "ilove you") || (event.body.toLowerCase() == "Ilove you")) {
     return api.sendMessage("Iloveyoutoo<3🥺", threadID, messageID);
   };

   if ((event.body.indexOf(`${global.config.BOTNAME}`) == 0)) {
    return api.sendMessage(rand2, threadID, messageID);
   };


  if ((event.body.toLowerCase() == "tol")) {
     return api.sendMessage("Tol tara Mamakla tayo", threadID, messageID);
   };

  if ((event.body.toLowerCase() == "wow")) {
     return api.sendMessage("sangkyu", threadID, messageID);
   };

   if ((event.body.toLowerCase() == "bye") || (event.body.toLowerCase() == "Bye")) {
     return api.sendMessage("Bye bye take care, mwa!😚" , threadID, messageID);
   };

  if (event.body.indexOf("bot") == 0 || (event.body.indexOf("Bot") == 0)) {
    var msg = {
      body: `${name}, ${rand}`
    }
    return api.sendMessage(msg, threadID, messageID);
  };

}

module.exports.run = function({ api, event, client, __GLOBAL }) { }