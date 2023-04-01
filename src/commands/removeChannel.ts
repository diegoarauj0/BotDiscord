import { SlashCommandBuilder, ChatInputCommandInteraction, Guild, ChannelType } from 'discord.js'
import Client from '../client'

const SlashCommand = new SlashCommandBuilder()
.setName('remove_channel')
.setNameLocalizations({
    "en-US":'remove_channel',
    'pt-BR':'remover_canal'
})
.setDescription('remove channel')
.setDescriptionLocalizations({
    'pt-BR':'remover o canal',
    'en-US':'remove channel'
})
.addChannelOption(Option => 
    Option
    .setName('channel')
    .setNameLocalizations({
        'pt-BR':'canal',
        'en-US':'channel'
    })
    .setDescription('the channel to be removed')
    .setDescriptionLocalizations({
        'pt-BR':'o canal que vai ser removido',
        'en-US':'the channel to be removed'
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

        let channelOption = interaction.options.getChannel('channel', true)
        let reasonOption = interaction.options.getString('reason', false)
        let channel = interaction.guild.channels.cache.get(channelOption.id)

        if (!channel) {
            client.commandsMessage.embedNotFound('canal')
            client.commandsMessage.send(true,true)
            return
        }

        let reason = `
        membro que removeu o canal: ${interaction.user.username}#${interaction.user.discriminator}👮‍♂️\n
        canal removido: ${channel.name}🗑️\n
        motivo: ${reasonOption || 'não definido'}📝
        `

        client.commandsMessage.setOldName = channel.name
        client.commandsMessage.setReason = reasonOption || undefined

        channel.delete(reason)
        .then(() => {
            client.commandsMessage.embedAction(true,'removeChannel')
            client.commandsMessage.send(true,false)
        })
        .catch(() => {
            client.commandsMessage.embedAction(false,'removeChannel')
            client.commandsMessage.send(true,true)
        }) 
    }
}