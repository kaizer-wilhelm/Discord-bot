const { Client, GatewayIntentBits, Collection, REST } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
require("keep-alive-replit").listen("80")

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.MessageContent] });
const rest = new REST({ version: '9' }).setToken("MTAyNTQ0MjE4NjkzMTc0ODkzNQ.G3IMcX.28s3wk4lkQJn6FTPgU66sbm8Iq1dLEn028on1g");

let chatcommands = new Collection();
let slashcommands = new Collection();
const decachedFiles = [];
const clientId = "1025442186931748935";
var flipflop = null;



async function unloadModules() {
    console.log("[INFO] Unloading all commands");
    chatcommands.clear();
    slashcommands.clear();
}

function nocache(module) {
    fs.watchFile(require("path").resolve(module), () => {
        delete require.cache[require.resolve(module)]; console.log("[INFO] Reloading " + module);
    });
}

async function loadModules() {
    console.log("[INFO] Loading all commands");
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.cjs'));
    for (const file of commandFiles) {
        if (!decachedFiles.includes(file)) {
            console.log("[INFO] Reloading " + file);
            nocache("./commands/" + file);
            decachedFiles.push(file);
        }

        const command = require(`./commands/${file}`);
        console.log("[LOADING MODULE] " + command.name);
        if (command.type == "chat") {

            chatcommands.set(command.name, command);
        } else if (command.type == "slash") {

            slashcommands.set(command.name, command);
        }
    }
}

async function registerCommands() {
    console.log("[INFO] Registering application (/) commands");
    try {
        commanddata = slashcommands.map(command => command.data);
        console.log(commanddata)
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commanddata },
        );
        console.log('[INFO] Loaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}
client.once('ready', () => {
    console.log('[INFO] Client logged in as ' + client.user.tag);
    loadModules()
    registerCommands();
})
client.on("messageCreate", async message => {

   if (flipflop==null&& message.content.startsWith("bot")) return flipflop=(await message.reply("yes, master?")).channel;
   else if (flipflop==null) return;
   if (message.channel.id != flipflop.id) return;
   if (message.content.startsWith("bot")) return;
   if (message.content.startsWith("never mind")) return flipflop=message.reply("oh, ok then.").xxxx?xxxx:null;
   if (message.content.startsWith("reload")) {
    message.reply ("okie dokie!");
       unloadModules();
       loadModules();
       registerCommands();
        message.reply("all reloaded!!")
       return flipflop=null;
   }
   const args = message.content.slice(1).trim().split(/ +/);
   const commandName = args.shift().toLowerCase();
   const command = chatcommands.get(commandName) || chatcommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
   if (!command) return;
   try {
       command.execute(message, args);
   } catch (error) {
       console.error(error);
       message.reply('there was an error trying to execute that command!');
   }
    
})
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = slashcommands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(client, interaction, interaction.options._hoistedOptions.map(x => x.value));
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
})


console.log("logging in")
client.login("MTAyNTQ0MjE4NjkzMTc0ODkzNQ.G3IMcX.28s3wk4lkQJn6FTPgU66sbm8Iq1dLEn028on1g");