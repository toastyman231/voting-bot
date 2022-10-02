const dotenv = require('dotenv');
dotenv.config();

//import fs from 'node:fs';
//import path from 'node:path';
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ],
});

client.commands = new Collection();
//var __dirname = path.resolve();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
	//if (!interaction.isChatInputCommand()) return;
    if (interaction.isButton()) {
        const vote = require("./commands/create-vote.js");
        //console.log(vote.votes[vote.index]);
        if (vote.votes[vote.index].users.includes(interaction.user.id) && interaction.customId.includes(vote.votes[vote.index].id)) {
            await interaction.reply({ content: "You already voted on this poll!", ephemeral: true });
        } else {
            await interaction.deferUpdate();
        } 
    } 
    
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);

	    try {
		    await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
	
});

client.login(process.env.DISCORD_TOKEN);