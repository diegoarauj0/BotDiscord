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

        client.botMessage.languages = interaction.locale
        client.botMessage.user = interaction.user

        if (!interaction.appPermissions?.has('ManageMessages')) {
            client.replyCommand(client.botMessage.messageBotPermission('ManageMessages'),interaction,true)
            return
        }

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            client.replyCommand(client.botMessage.messageUserPermission('ManageMessages'),interaction,true)
            return
        }

        let amountOption = interaction.options.getNumber('amount', true)
        let channel = interaction.channel

        if (!channel) {
            client.replyCommand(client.botMessage.messageNotFound('channel'),interaction,true)
            return
        }
        
        channel.bulkDelete(amountOption)
        .then(() => {
            client.replyCommand(client.botMessage.messageActionSuccess('clear'),interaction,true)
        })
        .catch(() => {
            client.replyCommand(client.botMessage.messageBotError(),interaction,true)
        })
    }
}