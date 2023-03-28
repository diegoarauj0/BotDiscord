import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, EmbedBuilder, APIEmbedField, RestOrArray } from 'discord.js'
import Client from '../client'
import discord from 'discord.js'

const SlashCommand = new SlashCommandBuilder()
.setName('help')
.setNameLocalizations({
    'pt-BR':'ajuda',
    'en-US':'help'
})
.setDescription('show command list')
.setDescriptionLocalizations({
    'pt-BR':'mostrar lista comandos',
    'en-US':'show command list'
})

export default {
    data:SlashCommand,
    async execute (interaction:ChatInputCommandInteraction<CacheType>, client:Client) {

        client.botMessage.languages = interaction.locale
        client.botMessage.user = interaction.user

        client.botMessage.messageHelp(client.botCommands)

        let embed = client.botMessage.messageHelp(client.botCommands)
        client.replyCommand(embed,interaction,false)
    }
}