'use strict';
const Discord = require('discord.js');
const fetch = require('node-fetch');
const { SlashCommandBuilder } = require("@discordjs/builders");
const puppeteer = require('puppeteer');
const path = require('node:path');

const command_name = path.basename(__filename).replace('.js', '');

let top100_url = 'https://www.draftbot.fr/economy/202859617917599745';

module.exports = {
    data: new SlashCommandBuilder()
        .setName(command_name)
        .setDescription('Permet d\'obtenir le nombre de Ploppy\'s en circulation dans le top 100.'),
    async execute(client, interaction) {
        await interaction.deferReply();
        console.log('Commande \'/' + this.data.name + '\' reçue. Calcul en cours...');

        let money = await current_money();
        const embed = new Discord.EmbedBuilder()
            .setTitle('__**Nombre de Ploppy\'s en circulation dans le top 100**__')
            .setDescription('**' + money.toString() + ' 💰**');
        
        interaction.editReply({ content: '', embeds: [embed] });

        console.log('Opération terminée !')
    },
};

async function current_money() {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
  
    await page.goto(top100_url);
  
    let total_money = 0;
  
    for (let i = 0; i < 100; i++) {
      let content = await page.evaluate('document.querySelectorAll("div.money span")[' + i.toString() + '].innerText');
      if (content.includes("k")) {
        total_money += 1000*parseFloat(content.replace("k",""));
      } else {
        total_money += parseFloat(content);
      }
    }
  
    await browser.close();
  
    return total_money;
  };
