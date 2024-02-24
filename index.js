require('dotenv').config();
const Discord = require('discord.js');
const puppeteer = require('puppeteer');

let url = 'https://www.draftbot.fr/economy/202859617917599745';

const client = new Discord.Client({
  intents: 3276799,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.on('ready', () => {
  client.user.setPresence({ activities: [{ name: '!money', type: Discord.ActivityType.Watching }], status: 'online' });
  console.log('Client connected as @' + client.user.tag);
  client.channels.fetch("1068895807857770579").then(channel => { channel.send('Bot is connected!'); });
});

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.once("disconnect", () => client.error("Bot is disconnecting...", "warn"));
client.once("reconnecting", () => client.warn("Bot reconnecting...", "log"));

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (message.content == '!money') {
    let msg = await message.reply('*En cours...*');
    console.log('Commande \'!money\' reçue. Calcul en cours...');
    try {
      let money = await current_money();
      const embed = new Discord.EmbedBuilder()
        .setTitle('__**Nombre de Ploppy\'s en circulation dans le top 100**__')
        .setDescription('**' + money.toString() + ' 💰**');
      msg.edit({ content: '', embeds: [embed] });
    } catch (error) {
      message.channel.send('__**Error:**__ ' + error.toString());
    }
  }
});


async function current_money() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

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

client.login(process.env.BOT_TOKEN);
