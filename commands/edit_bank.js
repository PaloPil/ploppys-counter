const { SlashCommandBuilder } = require("@discordjs/builders");
const path = require("node:path");
const Airtable = require("airtable");
const { alliances_list } = require("../index");

const command_name = path.basename(__filename).replace(".js", "");

const allowed_users = [
  "480794907095728128", //Roswhil (trésorier)
  "525729900670222337", //Zaxerone (administrateur)
  "763337508175216641", //PaloPil (développeur)
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
        .addChoices(...alliances_list)
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
      await interaction.deferReply();

      //Args handling
      let alliance_nickname = interaction.options
        .getString("alliance")
        .replace(" ", "")
        .toUpperCase();
      let montant = interaction.options.getInteger("montant");

      //Fetching the alliance
      let infos_alliance = await infos(alliance_nickname);

      let nom_alliance = infos_alliance[0];
      let solde_alliance = infos_alliance[1];
      let id_alliance = infos_alliance[2];

      if (nom_alliance == "") {
        console.log("Cette alliance n'existe pas.");
        await interaction.editReply({
          content: `L'alliance **${alliance_nickname}** n'existe pas.`,
        });
        return;
      } else {
        let nouveau_solde = solde_alliance + montant;

        if (nouveau_solde < 0) {
          console.log("Solde insuffisant pour cette opération.");
          await interaction.editReply({
            content: `Solde insuffisant pour cette opération. \n*(Manque **${-nouveau_solde}  💰**)*`,
          });
          return;
        } else {
          base("Banques d'alliance").update([
            {
              id: infos_alliance[2],
              fields: {
                Solde: nouveau_solde,
              },
            },
          ]);

          console.log(
            `Modification du solde de l'alliance '${alliance_nickname}' par ${montant} 💰. (Demande de @${interaction.user.username})`
          );

          process.stdout.write("Mise à jour dans la liste... ");
          (async () => {
            alliances_list.forEach((alliance) => {
              if (alliance.value.toUpperCase() == alliance_nickname) {
                alliance.argent = parseInt(nouveau_solde);
              }
            });
          })().then(async () => {
            console.log("Effectuée !");
            await interaction.editReply({
              content: `Le solde de la banque de l'alliance **${nom_alliance}** a été modifié de **${montant.toLocaleString(
                "fr-FR"
              )} 💰**. \n\n**__Nouveau solde :__ ${nouveau_solde.toLocaleString(
                "fr-FR"
              )} 💰**.`,
            });

            console.log("Opération terminée !");
          });
        }
      }
    } else {
      console.log(
        "Utilisateur non autorisé. Annulation immédiate de la commande."
      );
      await interaction.reply({
        content: "Vous n'êtes pas habilité à exécuter cette commande !",
        ephemeral: true,
      });
      return;
    }
  },
};

async function infos(alliance_nick) {
  let solde = 0;
  let nom = "";
  let id = "";
  let records = await base("Banques d'alliance")
    .select({
      filterByFormula: `{Diminutif} = "${alliance_nick}"`,
    })
    .firstPage();

  if (records.length > 0) {
    nom = records[0].get("Nom de l'alliance");
    solde = records[0].get("Solde");
    id = records[0].id;
  }

  return [nom, solde, id];
}
