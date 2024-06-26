require("dotenv").config();
const { Client, Collection } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const { REST } = require("@discordjs/rest");
const base64 = require("base-64");
const { Routes } = require("discord-api-types/v9");
const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);
const Airtable = require("airtable");

let alliances_list = [];

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base("appeYG7d19Q0JDnkh");

(async () => {
  let records = await base("Banques d'alliance")
    .select({
      fields: ["Nom de l'alliance", "Diminutif", "Solde"],
    })
    .firstPage();
  records.forEach((record) => {
    let nom = record.get("Nom de l'alliance");
    let diminutif = record.get("Diminutif");
    let solde = record.get("Solde");
    console.log("Loading alliance " + diminutif);
    alliances_list.push({ name: nom, value: diminutif, argent: solde });
  });
})().then(() => {
  const client = new Client({
    intents: 3276799,
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
  });

  client.commands = new Collection();

  const eventFiles = fs
    .readdirSync("./events")
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    console.log(`Loading event ${file}`);
    const event = require(`./events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(
        event.name,
        async (...args) => await event.execute(...args, client)
      );
    }
  }

  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
      console.log(`La commande ${command.data.name} a été chargée !`);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }

  const commands = [];

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }

  (async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`
      );

      const data = await rest.put(
        Routes.applicationCommands(
          base64.decode(process.env.BOT_TOKEN.split(".")[0])
        ),
        { body: commands }
      );

      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`
      );
    } catch (error) {
      console.error(error);
    }
  })();

  client.on("error", (e) => console.error(e));
  client.on("warn", (e) => console.warn(e));
  client.once("disconnect", () =>
    client.error("Bot is disconnecting...", "warn")
  );
  client.once("reconnecting", () => client.warn("Bot reconnecting...", "log"));

  client.login(process.env.BOT_TOKEN);
});

module.exports = { alliances_list };
