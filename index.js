const dotenv = require('dotenv');
dotenv.config();

const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ],
});

global.log = "";
global.logPath =  path.join(__dirname, 'logs');
if (!fs.existsSync(logPath)) fs.mkdirSync(logPath);
logPath = path.join(logPath, 'log.txt');

log = fs.readFile(logPath, (err, data) => {
    if (err) {
        fs.writeFile(logPath, "", (err) => {
            if (err) throw err
        })
        return;
    }

    //console.log("read file: " + data.toString());

    return data.toString();
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
        if (!vote.votes[vote.index].allowMultiple && vote.votes[vote.index].users.includes(interaction.user.id) && interaction.customId.includes(vote.votes[vote.index].id)) {
            writeLog(logPath, interaction.user.username + "(" + interaction.user.id + ")" + " voted on a poll they already voted on!");
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

async function readLog(path) {
    return fs.readFileSync(path, (err, data) => {
        if (err) {
            fs.writeFile(path, "", (err) => {
                if (err) throw err
            })
            return;
        }

        //console.log("read file: " + data.toString());
    
        return data.toString();
    });
}

async function writeLog(path, newData) {
    var today = new Date();
    var date = today.getMonth().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false}) + "-" +
                today.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false}) + "-" +
                today.getFullYear() + " ";
    var time = today.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false}) + ":" + 
            today.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false}) + ":" + 
            today.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});

    //console.log(readLog(path));
    previous = await readLog(path);
    fs.writeFile(logPath, previous + date + time + " - " + newData + "\n", (err) => {if (err) throw err});
    //console.log("wrote file: " + newData);
}

Logger = {
    read: readLog,
    write: writeLog
}

client.login(process.env.DISCORD_TOKEN);