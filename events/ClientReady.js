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
    console.log("Client connected as @" + client.user.tag);
    console.log("en ligne sur " + client.guilds.cache.size + " serveurs");
    /*client.channels.fetch("1068895807857770579").then((channel) => {
      channel.send("Bot is connected!");
    });*/
  },
};
