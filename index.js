// Create a discord bot using OpenAI API that interacts on the discord server
require('dotenv').config();
const { training} = require('../discord-bot/prompt.json');

const { Client, Intents, GatewayIntentBits, Partials, Discord, ChannelType } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

const { Configuration, OpenAIApi} = require('openai')
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

client.on('messageCreate', async function (message) {
    let tempModel = training;
    tempModel += `You: ${message.content}\n`;
  
    try {
      // Ignore messages from the bot itself
      if (message.author.bot) return;
  
      // Only respond to direct messages
      if (message.channel.type === 1) {

        console.log(`User: ${message.author.tag} | Message: ${message.content}`); // Log user messages

        const gptResponse = await openai.createCompletion({
          model: 'text-davinci-002',
          prompt: tempModel,
          max_tokens: 100,
          temperature: 0.9,
          stop: [' ChatGPT:'],
        });
        message.reply(`${gptResponse.data.choices[0].text}`);
        return;
      }
    } catch (err) {
      console.log(err);
    }
  });
  
  

// Log the bot into Discord
client.login(process.env.DISCORD_TOKEN);
console.log('Donnie is online!');

