const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('ping-cr-bot').setDescription('Shows if CR Bot is running'),
	new SlashCommandBuilder().setName('halving').setDescription('Shows countdown to next Elastos halving'),
	new SlashCommandBuilder().setName('election').setDescription('Shows current CR election status'),
	new SlashCommandBuilder().setName('proposals').setDescription('Shows current proposals in the council voting period'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);