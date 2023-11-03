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
    .setDescription('Roll the dice!')
    .addIntegerOption(option =>
      option
      .setName('amount')
        .setDescription('Number of dice to roll (1 or 2)')
        .setRequired(true)
    )
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

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setActivity('Rolling the dice...', { type: 'PLAYING' });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'roll') {
    const numDice = options.getInteger('amount');
    const sides = options.getInteger('sides');

    if (numDice === 1 || numDice === 2) {
      if ([4, 6, 8, 10, 12, 20].includes(sides)) {
        let results = [];

        for (let i = 0; i < numDice; i++) {
          const result = Math.floor(Math.random() * sides) + 1;
          results.push(result);
        }

        const diceText = numDice === 1 ? 'a' : 'two';
        await interaction.reply(`You rolled ${numDice === 1 ? 'a' : 'two'} D${sides} and got: **${results.join(' and ')}**`);
      } else {
        if (numDice === 1) {
          await interaction.reply('**That die does not exist!**');
        } else {
          await interaction.reply('**Those dice do not exist!**');
        }
      }
    } else {
      await interaction.reply('**Too many dice, silly!**');
    }
  }
});

client.login(token);
