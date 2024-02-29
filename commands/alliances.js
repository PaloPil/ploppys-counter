const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const path = require("node:path");
const { alliances_list } = require("..");

const command_name = path.basename(__filename).replace(".js", "");

module.exports = {
    data: new SlashCommandBuilder()
    .setName(command_name)
    .setDescription(
      "Permet d'avoir la liste des alliances possédant une banque sur le serveur."
    ),

  async execute(interaction) {
    console.log(`Commande '/${this.data.name}' reçue.`);
    
    await interaction.deferReply();

    let alliances = "";

    alliances_list.forEach((alliance) => {
      alliances = alliances + `• **${alliance.name}** *(${alliance.value.toUpperCase()})* \n`;
    });

    const embed = new EmbedBuilder()
      .setTitle("__**Liste des alliances**__")
      .setDescription(alliances)
    
    await interaction.editReply({ content: "", embeds: [embed] });

    console.log("Opération terminée.")

  }
}