require('dotenv').config();
const Discord = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const puppeteer = require('puppeteer');

const client = new Discord.Client({
  intents: 3276799,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.on('ready', () => {
  client.user.setPresence({ activities: [{ name: '/money100', type: Discord.ActivityType.Watching }], status: 'online' });
  console.log('Client connected as @' + client.user.tag);
  client.channels.fetch("1068895807857770579").then(channel => { channel.send('Bot is connected!'); });
});

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.once("disconnect", () => client.error("Bot is disconnecting...", "warn"));
client.once("reconnecting", () => client.warn("Bot reconnecting...", "log"));

client.commands = new Discord.Collection();

const eventFiles = fs
	.readdirSync("./events")
	.filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(
			event.name,
			async (...args) => await event.execute(...args, client)
		);
	}
};

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`La commande ${command.data.name} a été chargée !`)
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

const commands = [];

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(process.env.USER_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();

client.login(process.env.BOT_TOKEN);