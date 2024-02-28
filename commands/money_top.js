const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const puppeteer = require("puppeteer");
const path = require("node:path");
const { alliances_list } = require("../index");

const command_name = path.basename(__filename).replace(".js", "");

let topURL = "https://www.draftbot.fr/economy/202859617917599745";

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

    // Args handling
    let top = interaction.options.getInteger("top") || 100;

    await interaction.deferReply();
    console.log(`Calcul du nombre de Ploppy's dans le top ${top.toString()} en cours...`);

    let money = (await current_money(top)).toLocaleString("fr-FR");

    console.log(`${money} Ploppy's recensés.`);

    const embed = new EmbedBuilder()
      .setTitle(`__**Nombre de Ploppy's en circulation dans le top ${top.toString()} :**__`)
      .setDescription(`**${money} 💰**`);

    interaction.editReply({ content: "", embeds: [embed] });

    console.log("Opération terminée !");
  }
};

async function current_money(top) {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();

  await page.goto(topURL);

  let total_money = 0;

  for (let i = 0; i < top; i++) {
    let content = await page.evaluate(
      `document.querySelectorAll("div.money span")[${i.toString()}].innerText`
    );
    if (content.includes("k")) {
      total_money += 1000 * parseFloat(content.replace("k", ""));
    } else {
      total_money += parseFloat(content);
    }
  }

  await browser.close();

  return total_money;
}
