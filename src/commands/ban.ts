import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import Client from '../client'

const SlashCommand = new SlashCommandBuilder()
.setName('ban')
.setNameLocalizations({
    'pt-BR':'banir',
    'en-US':'ban'
})
.setDescription('ban a user from the server')
.setDescriptionLocalizations({
    'pt-BR':'banir um usuário do servidor',
    'en-US':'ban a user from the server'
})
.addUserOption(Option =>
    Option
    .setName('member')
    .setNameLocalizations({
        'pt-BR':'membro',
        'en-US':'member'
    })
    .setDescription('member to be banned')
    .setDescriptionLocalizations({
        'pt-BR':'membro a ser banido',
        'en-US':'member to be banned'
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
.addNumberOption(Option =>
    Option
    .setName('hours')
    .setNameLocalizations({
        'pt-BR':'horas',
        'en-US':'hours'
    })
    .setDescription('delete message history in hours')
    .setDescriptionLocalizations({
        'pt-BR':'excluir histórico de mensagens em horas',
        'en-US':'delete message history in hours'
    })
    .setMaxValue(168)
    .setMinValue(1)
    .setRequired(false)
)
export default {
    data:SlashCommand,
    async execute (interaction:ChatInputCommandInteraction<any>, client:Client) {

        if (!interaction.appPermissions?.has('BanMembers')) {
            client.commandsMessage.embedPermissionDenied('BanMembers', 'bot')
            client.commandsMessage.send(true,true)
            return
        }

        if (!interaction.memberPermissions.has('BanMembers')) {
            client.commandsMessage.embedPermissionDenied('BanMembers', 'member')
            client.commandsMessage.send(true,true)
            return
        }

        let memberOption = interaction.options.getUser('member', true)
        let reasonOption = interaction.options.getString('reason')
        let member = interaction.guild.members.cache.get(memberOption.id)

        if (!member) {
            client.commandsMessage.embedNotFound('membro')
            client.commandsMessage.send(true,true)
            return
        }

        client.commandsMessage.setTargetUser = member.user

        if (!member.bannable) {
            client.commandsMessage.embedUnable('bannable')
            client.commandsMessage.send(true,true)
            return
        }
        
        let hoursOption = interaction.options.getNumber('hours', false)
        let deleteMessageSeconds:number | undefined = !hoursOption?undefined:hoursOption * 3600

        let reason = `
        membro que baniu: ${interaction.user.username}#${interaction.user.discriminator}👮‍♂️\n
        membro banido: ${member.user.username}#${member.user.discriminator}➡️🚪\n
        motivo: ${reasonOption || 'não definido'}📝
        `

        client.commandsMessage.setReason = reasonOption || undefined

        member.ban({reason:reason, deleteMessageSeconds:deleteMessageSeconds})
        .then(() => {
            client.commandsMessage.embedAction(true,'ban')
            client.commandsMessage.send(true,false)
        })
        .catch(() => {
            client.commandsMessage.embedAction(false,'ban')
            client.commandsMessage.send(true,true)
        }) 
    }
}