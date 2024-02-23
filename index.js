require('dotenv').config();
const Discord = require('discord.js');
const puppeteer = require('puppeteer');

let url = 'https://www.draftbot.fr/economy/202859617917599745';

const client = new Discord.Client({
  intents: 3276799,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.on('ready', () => {
  client.user.setPresence({ activities: [{ name: '!money', type: Discord.ActivityType.Watching }], status: 'idle' });
  console.log('Client connected as @' + client.user.tag);
  client.channels.fetch("1068895807857770579").then(channel => { channel.send('Bot is connected!'); });
});

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.once("disconnect", () => client.error("Bot is disconnecting...", "warn"));
client.once("reconnecting", () => client.warn("Bot reconnecting...", "log"));

client.on('message', async message => {
  console.log('Message received!');
  message.channel.send('Starting count!')
  if (message.content == '!money') {
    console.log('Starting count!');
    let money = await current_money();
    message.reply('Il y a ' + money.toString() + ' Ploppy\'s en circulation dans le top 100.');
  }
});

client.on('messageCreate', async message => {
  if (message.content == '!money') {
    console.log('Starting count!');
    let money = await current_money();
    message.reply('Il y a ' + money.toString() + ' Ploppy\'s en circulation dans le top 100.');
  }
});


async function current_money() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  let total_money = 0;

  let top100 = await page.evaluate('() => Array.from(document.querySelectorAll("div.money span"), e => e.innerText)');

  for (let i = 0; i < 100; i++) {
    if (top100[i].includes("k")) {
      total_money += 1000*parseFloat(top100[i].replace("k",""));
    } else {
      total_money += parseFloat(top100[i]);
    }
  }

  await browser.close();

  return total_money;
};

client.login(process.env.BOT_TOKEN);
