const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const path = require("node:path");

const command_name = path.basename(__filename).replace(".js", "");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(command_name)
    .setDescription(
      "Bannir un utilisateur du serveur ! 🐟" // Fake ban : poisson d'avril
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("L'utilisateur à bannir ! :fish:")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("La raison du ban ! :fish:")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("timeout")
        .setDescription("Mettre en timeout l'utilisateur ?")
        .setRequired(false)
    ),

  async execute(interaction) {
    console.log(`Commande '/${this.data.name}' reçue. (fakeban)`);
    // Args handling
    const target = interaction.options.getUser("target");

    const raison =
      interaction.options.getString("raison") ?? "Pas de raison. ¯\\_(ツ)_/¯";
    
    const timeout = interaction.options.getBoolean("timeout") ?? false;

    // Execution

    const embed = new EmbedBuilder()
      .setTitle(
        `L'utilisateur \`${target.tag}\` a été banni pour la raison suivante :`
      )
      .setDescription(`*${raison}*`)
      .setImage("https://media1.tenor.com/m/Kt1irdU_daUAAAAC/ban-admin.gif")
      .setFooter({
        text: `Par ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp()
      .setColor("#FF0000");

    await interaction.reply({
      content: `<@${target.id}>`,
      embeds: [embed],
      ephemeral: false,
    });

    if (timeout && (interaction.memberPermissions.toArray().includes("KickMembers") || interaction.user.id == "763337508175216641" /* PaloPil */)) {
      try {
        const guildTarget = await interaction.guild.members.fetch(target);
        await guildTarget.timeout(30 * 1000);
        await interaction.followUp({
          content: `L'utilisateur a été mis en timeout pour 30 secondes.`,
          ephemeral: true,
        });
      } catch (error) {
        await console.log(
          "``` " + error.message.replace(`\\n`, "   ") + " ```"
        );
      }
    } else if (!(interaction.memberPermissions.toArray().includes("KickMembers") || interaction.user.id == "763337508175216641" /* PaloPil */)) {
      await interaction.followUp({
        content: `L'utilisateur n'a pas été mis en timeout. (Vous n'avez pas la permission)`,
        ephemeral: true,
      });
    }

    // Send a message in the same channel to explain the joke and delete it after 10 seconds if it is the first of April
    if (new Date().getDate() === 1 && new Date().getMonth() === 3) {
      const jokeMessage = await interaction.followUp({
        content: `||:fish:||`,
        ephemeral: false,
      });

      setTimeout(async () => {
        await jokeMessage.delete();
      }, 3 * 1000);
    }
  },
};
