const { Client, Collection, MessageButton, MessageActionRow, } = require('discord.js');

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {
        
        const { client } = interaction;

	    const command = interaction.client.commands.get(interaction.commandName);
        if (!interaction.isChatInputCommand()) return;

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}