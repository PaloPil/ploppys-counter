const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
const path = require("node:path");
/* const { alliances_list } = require("../index"); 
Je ne sais pas si tu comptes l'utiliser,
mais je laisse comme sa vue que pour l'instant sa ne sert pas dans le code.
*/
const command_name = path.basename(__filename).replace(".js", "");
let topURL = "https://api.draftbot.fr/activities/economy/202859617917599745";

module.exports = {
  data: new SlashCommandBuilder()
    .setName(command_name)
    .setDescription(
      "Permet d'obtenir le nombre de Ploppy's en circulation dans le top 100."
    )
    .addIntegerOption((option) =>
      option
        .setName("top")
        .setDescription(
          "Choisir le nombre de joueurs à prendre en compte - (Défaut : 100)"
        )
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(100)
    ),
  async execute(interaction) {
    console.log(`Commande '/${this.data.name}' reçue.`);

    let top = interaction.options.getInteger("top") || 100;

    await interaction.deferReply();

    console.log(
      `Calcul du nombre de Ploppy's dans le top ${top.toString()} en cours...`
    );

    let money = (await current_money(top)).toLocaleString("fr-FR");
    console.log(`${money} Ploppy's recensés.`);

    const embed = new EmbedBuilder()
      .setTitle(
        `__**Nombre de Ploppy's en circulation dans le top ${top.toString()} :**__`
      )
      .setDescription(`**${money} 💰**`);

    interaction.editReply({ content: "", embeds: [embed] });
    console.log("Opération terminée !");
  },
};

async function current_money(top) {
  try {
    const response = await axios.get(topURL);
    const users = response.data.users;
    let total_money = 0;

    for (let i = 0; i < Math.min(top, users.length); i++) {
      const user = users[i];
      const moneyString = user.money.toString();
      let money;

      if (moneyString.includes("k")) {
        money = parseFloat(moneyString.replace("k", "")) * 1000;
      } else if (moneyString.includes("m")) {
        money = parseFloat(moneyString.replace("m", "")) * 1000000;
      } else {
        money = parseFloat(moneyString);
      }

      total_money += money;
    }

    return Math.round(total_money);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
