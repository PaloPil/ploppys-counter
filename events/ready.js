const { ActivityType } = require("discord.js");

module.exports = {
  name: "ClientReady",

  async execute(interaction) {
    interaction.client.user.setPresence({
      activities: [{ name: "Your money 💰", type: ActivityType.Watching }],
      status: "online",
    });
    console.log("Client connected as @" + client.user.tag);
    interaction.client.channels.fetch("1068895807857770579").then((channel) => {
      channel.send("Bot is connected!");
    });
  },
};
