const cooldowns = {};
module.exports.config = {
  name: "adduser",
  version: "1.5.8",
  cooldowns: 5,
  role: 0,
  aliases: ['system']
};

module.exports.run = async function ({ api, event, args }) {
  const userId = event.senderID;
  const cooldownTime = module.exports.config.cooldowns * 5000;

    if (cooldowns[userId] && Date.now() - cooldowns[userId] < cooldownTime) {
      const remainingTime = Math.ceil((cooldowns[userId] + cooldownTime - Date.now()) / 5000);
      api.sendMessage(`⏱️ | The command you used "adduser" has a cooldown, just wait for ${remainingTime} seconds.`, event.threadID, event.messageID);
      return;
    }
    cooldowns[userId] = Date.now();
  const { threadID, messageID } = event;
  const botID = api.getCurrentUserID();
  const out = msg => api.sendMessage(msg, threadID, messageID);
  var { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
  var participantIDs = participantIDs.map(e => parseInt(e));
  if (!args[0]) return out("Please enter an id/link profile user to add.");
  if (!isNaN(args[0])) return adduser(args[0], undefined);
  else {
    try {
      var [id, name, fail] = await getUID(args[0], api);
      if (fail == true && id != null) return out(id);
      else if (fail == true && id == null) return out("User ID not found.")
      else {
        await adduser(id, name || "Facebook users");
      }
    } catch (e) {
      return out(`${e.name}: ${e.message}.`);
    }
  }

  async function adduser(id, name) {
    id = parseInt(id);
    if (participantIDs.includes(id)) return out(`${name ? name : "Member"} is already in the group.`);
    else {
      var admins = adminIDs.map(e => parseInt(e.id));
      try {
        await api.addUserToGroup(id, threadID);
      }
      catch {
        return out(`Can't add ${name ? name : "user"} in group.`);
      }
      if (approvalMode === true && !admins.includes(botID)) return out(`Added ${name ? name : "member"} to the approved list !`);
      else return out(`Added ${name ? name : "member"} to the group !`)
    }
  }
}