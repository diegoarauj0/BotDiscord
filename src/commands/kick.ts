import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import Client from '../client'

const SlashCommand = new SlashCommandBuilder()
.setName('kick')
.setNameLocalizations({
    'en-US':'kick',
    'pt-BR':'expulsar'
})
.setDescription('kick member from server')
.setDescriptionLocalizations({
    'pt-BR':'expulsar o membro do servidor',
    'en-US':'kick member from server'
})
.addUserOption(Option =>
    Option
    .setName('member')
    .setNameLocalizations({
        'pt-BR':'membros',
        'en-US':'member'
    })
    .setDescription('member to be kicked')
    .setDescriptionLocalizations({
        'pt-BR':'membro a ser expulso',
        'en-US':'member to be kicked'
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

        if (!interaction.appPermissions?.has('KickMembers')) {
            client.commandsMessage.embedPermissionDenied('KickMembers', 'bot')
            client.commandsMessage.send(true,true)
            return
        }

        if (!interaction.memberPermissions.has('KickMembers')) {
            client.commandsMessage.embedPermissionDenied('KickMembers', 'member')
            client.commandsMessage.send(true,true)
            return
        }

        let userOption = interaction.options.getUser('member', true)
        let reasonOption = interaction.options.getString('reason')
        let member = interaction.guild.members.cache.get(userOption.id)

        if (!member) {
            client.commandsMessage.embedNotFound('membro')
            client.commandsMessage.send(true,true)
            return
        }

        client.commandsMessage.setTargetUser = member.user

        if (!member.kickable) {
            client.commandsMessage.embedUnable('kickable')
            client.commandsMessage.send(true,true)
            return
        }

        let reason = `
        membro que expulsor: ${interaction.user.username}#${interaction.user.discriminator}👮‍♂️\n
        membro expulso: ${member.user.username}#${member.user.discriminator}➡️🚪\n
        motivo: ${reasonOption || 'não definido'}📝
        `

        client.commandsMessage.setReason = reason

        member.kick(reason)
        .then(() => {
            client.commandsMessage.embedAction(true,'kick')
            client.commandsMessage.send(true,false)
        })
        .catch(() => {
            client.commandsMessage.embedAction(false,'kick')
            client.commandsMessage.send(true,true)
        })
    }
}