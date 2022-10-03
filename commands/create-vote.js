const { SlashCommandBuilder, ComponentType, ButtonBuilder, ButtonStyle, ActionRowBuilder, Client, BaseInteraction, InteractionType } = require('discord.js');
const fs = require('node:fs');

votesList = [];
voteIndex = 0;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-vote')
		.setDescription('Starts a new vote!')
        .addStringOption(option => 
            option.setName("prompt")
                .setDescription("The prompt which users will be voting on.")
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName("timeout")
                .setDescription("How long before the vote ends? (In seconds)")
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName("allow-multiple-votes")
            .setDescription("Should the poll allow users to vote more than once?")
            .setRequired(true))
        .addStringOption(option => 
            option.setName("option1")
                .setDescription("The first option")
                .setRequired(true))
        .addStringOption(option => 
            option.setName("option2")
                .setDescription("The second option")
                .setRequired(true))
        .addStringOption(option => 
            option.setName("option3")
                .setDescription("The third option")
                .setRequired(false))
        .addStringOption(option => 
            option.setName("option4")
                .setDescription("The fourth option")
                .setRequired(false)),
    votes: votesList,
    index: voteIndex,
	async execute(interaction) {
        //votes = [0,0,0,0];
        random = Math.random();
        hashCode = hash(interaction.options.getString('prompt') + random);

        votesList.push(new Vote(hashCode, interaction.options.getBoolean("allow-multiple-votes")));

        const op1 = new ButtonBuilder()
                .setCustomId(hashCode + '-option1')
                .setLabel(interaction.options.getString('option1'))
                .setStyle(ButtonStyle.Primary);
        const op2 = new ButtonBuilder()
                .setCustomId(hashCode + '-option2')
                .setLabel(interaction.options.getString('option2'))
                .setStyle(ButtonStyle.Primary);
        op3 = null;
        op4 = null;
        try {
            op3 = new ButtonBuilder()
                .setCustomId(hashCode + '-option3')
                .setLabel(interaction.options.getString('option3'))
                .setStyle(ButtonStyle.Primary);
        } catch {
            console.log("No option 3");
            //const op3 = null;
        }
        try {
            op4 = new ButtonBuilder()
                .setCustomId(hashCode + '-option4')
                .setLabel(interaction.options.getString('option4'))
                .setStyle(ButtonStyle.Primary);
        } catch {
            console.log("No option 4");
            //const op4 = null;
        }

        row = new ActionRowBuilder()
            .addComponents(op1)
            .addComponents(op2);

        const labels = [interaction.options.getString('option1'), interaction.options.getString('option2')];
        if (op3 !== null) {
            row.addComponents(op3);
            labels.push(interaction.options.getString('option3'));
        }
        if (op4 !== null) {
            row.addComponents(op4);
            labels.push(interaction.options.getString('option4'));
        }

        multiVotes = interaction.options.getBoolean("allow-multiple-votes");

        //console.log(interaction.options.getString('prompt') + (multiVotes ? " (Allows multiple votes)" : ""));
        const msg = await interaction.reply({content: interaction.options.getString('prompt') + (multiVotes ? " (Allows multiple votes)" : ""), components: [row] });

        Logger.write(logPath, interaction.user.username + "(" + interaction.user.id + ")" + " created a new poll. ID: " + msg.id);

        const collector = await msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: interaction.options.getInteger("timeout") * 1000});

        collector.on('collect', async i => {
            votesList.forEach(async element => {
                //console.log(element.users);
                if (i.customId.includes(element.id)) {
                    voteIndex = votesList.indexOf(element);

                    if (!interaction.options.getBoolean("allow-multiple-votes") && element.users.includes(i.user.id)) return;

                    logIndex = 0;

                    if (i.customId.includes('option1')) {
                        element.votes[0]++;
                    } else if (i.customId.includes('option2')) {
                        element.votes[1]++;
                        logIndex = 1;
                    } else if (i.customId.includes('option3')) {
                        element.votes[2]++;
                        logIndex = 2;
                    } else if (i.customId.includes('option4')) {
                        element.votes[3]++;
                        logIndex = 3;
                    }
                    
                    index = 0;
                    row.components.forEach(element1 => {
                        tempIndex = index;
                        if (row.components.length == 3 && index == 2) tempIndex = 3;
                        element1.setLabel(labels[index] + " (Votes: " + element.votes[tempIndex] + ")");
                        //element1.setDisabled(true);
                        index++;
                    });

                    Logger.write(logPath, interaction.user.username + "(" + interaction.user.id + ")" + " voted for " + labels[logIndex] + " on poll " + msg.id);

                    element.users.push(i.user.id);
                    await interaction.editReply({ content: interaction.options.getString('prompt') + (multiVotes ? " (Allows multiple votes)" : ""), components: [row] });
                }
            });
        });

        collector.on('end', async i => {
            Logger.write(logPath, "Poll " + msg.id + " ended.");

            await interaction.editReply({ content: "This poll has ended! Original prompt: " + 
                        interaction.options.getString('prompt') + (interaction.options.getBoolean("allow-multiple-votes") ? " (Allows multiple votes)" : ""), components: [row] });
        })
	},
};

class Vote {
    constructor(code, allow) {
        this.id = code;
        this.votes = [0,0,0,0];
        this.users = [];
        this.allowMultiple = allow;
    }
}

var hash = function(s) {
    /* Simple hash function. */
    var a = 1, c = 0, h, o;
    if (s) {
        a = 0;
        /*jshint plusplus:false bitwise:false*/
        for (h = s.length - 1; h >= 0; h--) {
            o = s.charCodeAt(h);
            a = (a<<6&268435455) + o + (o<<14);
            c = a & 266338304;
            a = c!==0?a^c>>21:a;
        }
    }
    return String(a);
};