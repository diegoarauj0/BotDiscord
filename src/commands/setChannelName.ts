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
.addStringOption(Option => 
    Option
    .setName('reason')
    .setNameLocalizations({
        'pt-BR':'motivo',
        'en-US':'reason'
    })
    .setDescription('reason for the ban')
    .setDescriptionLocalizations({
        'pt-BR':'motivo do banimento',
        'en-US':'reason for the ban'
    })
    .setRequired(false)
)

export default {
    data:SlashCommand,
    async execute (interaction:ChatInputCommandInteraction<any>, client:Client) {

        if (!interaction.appPermissions?.has('ManageChannels')) {
            client.commandsMessage.embedPermissionDenied('ManageChannels', 'bot')
            client.commandsMessage.send(true,true)
            return
        }

        if (!interaction.memberPermissions.has('ManageChannels')) {
            client.commandsMessage.embedPermissionDenied('ManageChannels', 'member')
            client.commandsMessage.send(true,true)
            return
        }

        let nameOption = interaction.options.getString('name',true)
        let reasonOption = interaction.options.getString('reason',false)
        let channel:GuildTextBasedChannel | null = interaction.channel
        let reason = `
        quem altero o nome do canal: ${interaction.user.username}#${interaction.user.discriminator}👮‍♂️\n
        nome antigo: ${channel?.name}➡️🚪\n
        nome novo: ${nameOption}📝\n
        motivo:${reasonOption}📝
        `

        client.commandsMessage.setReason = reasonOption || undefined
        client.commandsMessage.setNewName = nameOption
        client.commandsMessage.setOldName = channel?.name

        channel?.setName(nameOption, reason)
        .then(() => {
            client.commandsMessage.embedAction(true,'setChannelName')
            client.commandsMessage.send(true,false)
        })
        .catch(() => {
            client.commandsMessage.embedAction(false,'setChannelName')
            client.commandsMessage.send(true,true)
        })
    }
}