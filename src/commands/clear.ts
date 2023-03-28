import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import Client from '../client'

const SlashCommand = new SlashCommandBuilder()
.setName('clear')
.setNameLocalizations({
    'pt-BR':'clear'
})
.setDescription('clear messages from a channel')
.setDescriptionLocalizations({
    'pt-BR':'limpar mensagens de um canal'
})
.addNumberOption(Option =>
    Option
    .setName('amount')
    .setNameLocalizations({
        'pt-BR':'quantos'
    })
    .setDescription('amount of message to clear')
    .setDescriptionLocalizations({
        'pt-BR':'quantidade de mensagem para deletar'
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
            client.replyCommand(client.botMessage.messageBotPermission('ManageMessages'),interaction)
            return
        }

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            client.replyCommand(client.botMessage.messageUserPermission('ManageMessages'),interaction)
            return
        }

        let amountOption = interaction.options.getNumber('amount', true)
        let channel = interaction.channel

        if (!channel) {
            client.replyCommand(client.botMessage.messageNotFound('channel'),interaction)
            return
        }
        
        channel.bulkDelete(amountOption)
        .then(() => {
            client.replyCommand(client.botMessage.messageActionSuccess('clear'),interaction)
        })
        .catch(() => {
            client.replyCommand(client.botMessage.messageBotError(),interaction)
        })
    }
}