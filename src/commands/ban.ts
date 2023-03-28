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
        'pt-BR':'membros',
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

        client.botMessage.languages = interaction.locale
        client.botMessage.user = interaction.user

        if (!interaction.appPermissions?.has('BanMembers')) {
            client.replyCommand(client.botMessage.messageBotPermission('BanMembers'), interaction, true)
            return
        }

        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            client.replyCommand(client.botMessage.messageUserPermission('BanMembers'), interaction, true)
            return
        }

        let memberOption = interaction.options.getUser('member', true)
        let reasonOption = interaction.options.getString('reason')
        let member = interaction.guild.members.cache.get(memberOption.id)

        if (!member) {
            client.replyCommand(client.botMessage.messageNotFound('member'), interaction, true)
            return
        }

        if (!member.bannable) {
            client.replyCommand(client.botMessage.messageBannableOrkickable('bannable'), interaction, true)
            return
        }

        client.botMessage.target = member.user
        
        let hoursOption = interaction.options.getNumber('hours', false)
        let deleteMessageSeconds:number | undefined = 0
        deleteMessageSeconds = !hoursOption?undefined:hoursOption * 3600
        let reason = `${interaction.user.username}#${interaction.user.discriminator} => ${member.user.username}#${member.user.discriminator}: ${reasonOption || 'not found'}`

        member.ban({reason:reason, deleteMessageSeconds:deleteMessageSeconds})
        .then(() => {
            client.replyCommand(client.botMessage.messageActionSuccess('ban'),interaction, true)
        })
        .catch(() => {
            client.replyCommand(client.botMessage.messageBotError(),interaction, true)
        }) 
    }
}