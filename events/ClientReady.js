const { ActivityType, Events } = require("discord.js");
const { alliances_list } = require("../index");

module.exports = {
  name: Events.ClientReady,
  once: true,

  async execute(client) {
    client.user.setPresence({
      activities: [{ name: "Your money 💰", type: ActivityType.Watching }],
      status: "online",
    });
    console.log(`En ligne sur ${client.guilds.cache.size} serveurs en tant que @${client.user.tag} !`);
  },
};
