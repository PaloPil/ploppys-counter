const { SlashCommandBuilder } = require("@discordjs/builders");
const path = require("node:path");
const Airtable = require("airtable");

const command_name = path.basename(__filename).replace(".js", "");

const allowed_users = [
  "480794907095728128", //Roswhil (trésorier)
  "525729900670222337", //Zaxerone (administrateur)
  "763337508175216641" //PaloPil (développeur) TEMPORAIRE : AUTORISATION A SUPPRIMER
];

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base("appeYG7d19Q0JDnkh");

module.exports = {
    data: new SlashCommandBuilder()
    .setName(command_name)
    .setDescription(
      "Permet de modifier le solde de la banque d'une alliance. (personnes autorisées uniquement)"
    )
    .addStringOption((option) =>
      option
        .setName("alliance")
        .setDescription(
          "Anagramme de l'alliance dont on souhaite modifier le solde."
        )
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("montant")
        .setDescription(
          "Montant à ajouter ou retirer de la banque de l'alliance."
        )
        .setRequired(true)
    ),

  async execute(interaction) {
    console.log(`Commande '/${this.data.name}' reçue.`);

    if (allowed_users.includes(interaction.user.id)) {
      //Args handling
      let alliance_nickname = interaction.options.getString("alliance").replace(" ", "").toUpperCase();
      let montant = interaction.options.getInteger("montant");

      console.log(`Modification du solde de l'alliance '${alliance_nickname}' par ${montant} 💰`);

    } else {
      console.log("Utilisateur non autorisé. Annulation immédiate de la commande.");
      await interaction.reply({ content: "Vous n'êtes pas habilité à exécuter cette commande !", ephemeral: true });
      return;
    }
  }
}