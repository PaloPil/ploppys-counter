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
    console.log(`Le bot est en ligne en tant que @${client.user.tag} (sur ${client.guilds.cache.size} serveurs)`);
  },
};
