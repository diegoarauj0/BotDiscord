import discord from 'discord.js'
import Client from '../client'

export default (interaction:discord.Interaction<discord.CacheType>, client:Client): discord.Awaitable<void> => {
    
    if (!interaction.isChatInputCommand()) return

    let command = client.botCommands.get(interaction.commandName || '')

    if (!command) {
        let embed = new discord.EmbedBuilder()
        .setAuthor({ name:interaction.user.username, iconURL:interaction.user.displayAvatarURL()})
        .setTimestamp()
        .setColor('Red')
        .setTitle('Comando não encontrado')
        .setDescription(`${interaction.command?.name || ''} esse comando não existe 😢, (eu acho🤔)`)
        interaction.reply({ embeds:[embed]})
        return
    }

    client.commandsMessage.resetValue()
    client.commandsMessage.setInteractionUser = interaction.user
    client.commandsMessage.setInteraction = interaction
    client.commandsMessage.setLocale = interaction.locale

    command.execute(interaction, client)
}