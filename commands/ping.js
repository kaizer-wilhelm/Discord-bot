const { SlashCommandBuilder} = require("discord.js")
module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping Pong!"),
    async esecute(interaction, client) {
        interaction.reply("pong")
    }
}