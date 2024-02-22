const axios = require('axios');
const fs = require('fs');

module.exports.config = {
  name: 'ai',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'Ainz',
  description: 'An BardAI with Image recognition!',
  usePrefix: false,
  commandCategory: 'chatbots',
  usages: '',
  cooldowns: 0,
};

module.exports.run = async function({ api, event, args }) {
  const prompt = args.join(' ');
  let credits = this.config.credits;

  if (!prompt) {
    const messages = ["Hello👋", "Oy", "Wassup", "Hey"];
    const message = messages[Math.floor(Math.random() * messages.length)];
    api.sendMessage(message, event.threadID, event.messageID);
    api.setMessageReaction("❤", event.messageID, () => { }, true);
    return
  }

  let imageUrl;
  let cookie = "fAjuWT4BtPjo9AsS3LdkVZ8KjMnuozFjb8j94Kowgbj9bOlXVpFQ6ddunid0-DT71xVYbg."; //////// Need Cookie ///////

  if (event.type === 'message_reply' && event.messageReply.attachments) {
    const attachment = event.messageReply.attachments[0];
    if (attachment.type === 'photo' || attachment.type === 'audio') {
      imageUrl = attachment.url;
    }
  }

  try {
    api.setMessageReaction("⏱️", event.messageID, () => { }, true);
    const res = await axios.post('https://bard-api.replit.app/ ', {
      message: prompt,
      credits: credits,
      image_url: imageUrl,
      cookie: cookie,
    });
    const imageUrls = res.data.imageUrls;
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
      const attachments = [];

      if (!fs.existsSync("cache")) {
        fs.mkdirSync("cache");
      }

      for (let i = 0; i < imageUrls.length; i++) {
        const url = imageUrls[i];
        const imagePath = `cache/image${i + 1}.png`;

        try {
          const imageResponse = await axios.get(url, { responseType: "arraybuffer" });
          fs.writeFileSync(imagePath, imageResponse.data);

          attachments.push(fs.createReadStream(imagePath));
        } catch (error) {
          console.error("Error occurred while downloading and saving the image:", error);
        }
      }

      api.sendMessage(
        {
          attachment: attachments,
          body: res.data.message,
        },
        event.threadID,
        event.messageID
      );
      api.setMessageReaction("✅", event.messageID, () => { }, true);
    } else {
      api.sendMessage(res.data.message, event.threadID, event.messageID);
      api.setMessageReaction("✅", event.messageID, () => { }, true);
    }
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage(`Error: ${error}`, event.threadID, event.messageID);
    api.setMessageReaction("⚠️", event.messageID, () => { }, true);
  }
};