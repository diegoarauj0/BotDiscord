import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import Client from '../client'

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
    async execute (interaction:ChatInputCommandInteraction<any>, client:Client) {

        client.commandsMessage.setCommands = client.botCommands
        client.commandsMessage.embedHelp()
        client.commandsMessage.send(true,false)
    }
}