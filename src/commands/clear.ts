import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import Client from '../client'

const SlashCommand = new SlashCommandBuilder()
.setName('clear')
.setNameLocalizations({
    'pt-BR':'clear',
    'en-US':'clear'
})
.setDescription('clear messages from a channel')
.setDescriptionLocalizations({
    'pt-BR':'limpar mensagens de um canal',
    'en-US':'clear messages from a channel'
})
.addNumberOption(Option =>
    Option
    .setName('amount')
    .setNameLocalizations({
        'pt-BR':'quantos',
        'en-US':'amount'
    })
    .setDescription('amount of message to clear')
    .setDescriptionLocalizations({
        'pt-BR':'quantidade de mensagem para deletar',
        'en-US':'amount of message to clear'
    })
    .setMaxValue(100)
    .setMinValue(1)
    .setRequired(true)
)

export default {
    data:SlashCommand,
    async execute (interaction:ChatInputCommandInteraction<any>, client:Client) {

        if (!interaction.appPermissions?.has('ManageMessages')) {
            client.commandsMessage.embedPermissionDenied('ManageMessages', 'bot')
            client.commandsMessage.send(true,true)
            return
        }

        if (!interaction.memberPermissions.has('ManageMessages')) {
            client.commandsMessage.embedPermissionDenied('ManageMessages', 'member')
            client.commandsMessage.send(true,true)
            return
        }

        let amountOption = interaction.options.getNumber('amount', true)
        let channel = interaction.channel
        client.commandsMessage.setMessageNumber = amountOption

        if (!channel) {
            client.commandsMessage.embedNotFound('canal')
            client.commandsMessage.send(true,true)
            return
        }
        
        channel.bulkDelete(amountOption)
        .then(() => {
            client.commandsMessage.embedAction(true,'clear')
            client.commandsMessage.send(true,false)
        })
        .catch(() => {
            client.commandsMessage.embedAction(false,'clear')
            client.commandsMessage.send(true,true)
        })
    }
}