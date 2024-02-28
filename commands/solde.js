const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const path = require("node:path");
const Airtable = require("airtable");
const { alliances_list } = require("../index");

const command_name = path.basename(__filename).replace(".js", "");

let test_list = [ { name: 'AEBA', value: 'AEBA' }, { name: 'UMC', value: 'UMC' } ];

Airtable.configure({
    endpointUrl: "https://api.airtable.com",
    apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base("appeYG7d19Q0JDnkh");


module.exports = {
    data: new SlashCommandBuilder()
    .setName(command_name)
    .setDescription(
      "Permet d'obtenir le solde de la banque d'une alliance."
    )
    .addStringOption((option) =>
      option
        .setName("alliance")
        .setDescription(
          "Anagramme de l'alliance dont on souhaite obtenir le solde."
        )
        .setRequired(true)
        .addChoices(
            ...alliances_list
        )
    ),

  async execute(interaction) {
    console.log(`Commande '/${this.data.name}' reçue.`);

    // Args handling
    let alliance_nickname = interaction.options.getString("alliance").replace(" ", "").toUpperCase();
    console.log(`Recherche du solde de l'alliance '${alliance_nickname}'`);

    await interaction.deferReply();

    let infos_alliance = await infos(alliance_nickname);

    let nom_alliance = infos_alliance[0];
    let solde_alliance = infos_alliance[1].toLocaleString("fr-FR");

    if (nom_alliance == "") {
        console.log("Cette alliance n'existe pas.")
        interaction.editReply({ content: `L'alliance **${alliance_nickname}** n'existe pas.` });
        return;
    } else {
        console.log(`Solde de l'alliance : ${solde_alliance} 💰`);
        const embed = new EmbedBuilder()
        .setTitle(`__**Solde de la banque de l'alliance**__`)
        .setDescription(`__**${nom_alliance}**__ \n\n **${solde_alliance} 💰**`);

        interaction.editReply({ content: "", embeds: [embed] });
    }

    console.log("Opération terminée !");
  }
}

async function infos(alliance_nick) {
    let solde = 0;
    let nom = "";
    let records = await base("Banques d'alliance").select({
        filterByFormula: `{Diminutif} = "${alliance_nick}"`
    }).firstPage();

    if (records.length > 0) {
        nom = records[0].get("Nom de l'alliance");
        solde = records[0].get("Solde");
    }

    return [nom, solde];
}