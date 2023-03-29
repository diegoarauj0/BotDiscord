import { SlashCommandBuilder, ChatInputCommandInteraction, GuildTextBasedChannel, EmbedBuilder } from 'discord.js'
import Client from '../client'

const SlashCommand = new SlashCommandBuilder()
.setName('set_channel_name')
.setNameLocalizations({
    "en-US":'set_channel_name',
    'pt-BR':'definir_nome_canal'
})
.setDescription('change channel name')
.setDescriptionLocalizations({
    'pt-BR':'alterar o nome do canal',
    'en-US':'change channel name'
})
.addStringOption(Option =>
    Option
    .setName('name')
    .setNameLocalizations({
        'en-US':'name',
        'pt-BR':'nome'
    })
    .setDescription('new channel name')
    .setDescriptionLocalizations({
        'en-US':'new channel name',
        'pt-BR':'novo nome do canal'
    })
    .setRequired(true)
)

export default {
    data:SlashCommand,
    async execute (interaction:ChatInputCommandInteraction<any>, client:Client) {

        if (!interaction.appPermissions?.has('ManageChannels')) {
            client.replyCommand(client.botMessage.messageBotPermission('ManageChannels'), interaction, true)
            return
        }

        if (!interaction.memberPermissions?.has('ManageChannels')) {
            client.replyCommand(client.botMessage.messageUserPermission('ManageChannels'), interaction, true)
            return
        }

        let nameOption = interaction.options.getString('name',true)
        let channel:GuildTextBasedChannel | null = interaction.channel

        channel?.setName(nameOption, `${interaction.member.user.username}#${interaction.member.user.discriminator}`)
        .then(() => {
            client.replyCommand(client.botMessage.messageActionSuccess('setChannelName'), interaction, true)
            return
        })
        .catch(() => {
            client.replyCommand(client.botMessage.messageBotError(), interaction, true)
        })
    }
}