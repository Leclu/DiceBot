const { Client, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Routes } = require('discord-api-types/v10');

const token = '';
const clientId = '';
const guildId = '';

const commands = [
  new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll a die')
    .addIntegerOption(option =>
      option
        .setName('sides')
        .setDescription('Number of sides on the die')
        .setRequired(true)
    )
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ]
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setPresence({
    activities: [
      {
        name: 'Roll the dice...',
        type: 'PLAYING',
      },
    ],
    status: 'idle',
  });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'roll') {
    const sides = options.getInteger('sides');
    if (sides) {
      if (sides && [4, 6, 8, 10, 12, 20].includes(sides)) {
        const result = Math.floor(Math.random() * sides) + 1;
        await interaction.reply(`You rolled a D${sides} and got: ${result}`);
      } else {
        await interaction.reply('That die does not exist!');
      }
    }
  }
});

client.login(token);
