const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('ping-cr-bot').setDescription('Show status of CR Bot'),
	new SlashCommandBuilder().setName('bpos').setDescription('Show BPoS information'),
  new SlashCommandBuilder().setName('halving').setDescription('Show Elastos halving information'),
	new SlashCommandBuilder().setName('election').setDescription('Show CR election status'),
	new SlashCommandBuilder().setName('proposals').setDescription('Show proposals in the CR council voting period'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);