import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import Client from '../client'

const SlashCommand = new SlashCommandBuilder()
.setName('ban')
.setNameLocalizations({
    'pt-BR':'banir'
})
.setDescription('ban a user from the server')
.setDescriptionLocalizations({
    'pt-BR':'banir um usuário do servidor'
})
.addUserOption(Option =>
    Option
    .setName('member')
    .setNameLocalizations({
        'pt-BR':'membros'
    })
    .setDescription('member to be banned')
    .setDescriptionLocalizations({
        'pt-BR':'membro a ser banido'
    })
    .setRequired(true)
)
.addStringOption(Option => 
    Option
    .setName('reason')
    .setNameLocalizations({
        'pt-BR':'motivo'
    })
    .setDescription('reason for the ban')
    .setDescriptionLocalizations({
        'pt-BR':'motivo do banimento'
    })
    .setRequired(false)
)
.addNumberOption(Option =>
    Option
    .setName('hours')
    .setNameLocalizations({
        'pt-BR':'horas'
    })
    .setDescriptionLocalizations({
        'pt-BR':'excluir histórico de mensagens em horas'
    })
    .setDescription('delete message history in hours')
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
            let embed = client.botMessage.messageBotPermission('BanMembers')
            interaction.reply({ embeds:[embed], ephemeral:true })
            .then((message) => {setTimeout(() => {message.delete()},client.botCommandDeleteTime)})
            .catch(() => {return})
            return
        }

        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            let embed = client.botMessage.messageUserPermission('BanMembers')
            interaction.reply({ embeds:[embed], ephemeral:true })
            .then((message) => {setTimeout(() => {message.delete()},client.botCommandDeleteTime)})
            .catch(() => {return})
            return
        }

        let memberOption = interaction.options.getUser('member', true)
        let reasonOption = interaction.options.getString('reason')

        let member = interaction.guild.members.cache.get(memberOption.id)

        if (!member) {
            let embed = client.botMessage.messageNotFound('member')
            interaction.reply({ embeds:[embed], ephemeral:true })
            .then((message) => {setTimeout(() => {message.delete()},client.botCommandDeleteTime)})
            .catch(() => {return})
            return
        }

        client.botMessage.target = member.user
        let hoursOption = interaction.options.getNumber('hours', false)

        let deleteMessageSeconds:number | undefined = 0
        deleteMessageSeconds = !hoursOption?undefined:hoursOption * 3600
        
        let reason = `${interaction.user.username}#${interaction.user.discriminator} => ${member.user.username}#${member.user.discriminator}: ${reasonOption || 'not found'}`

        member.ban({reason:reason, deleteMessageSeconds:deleteMessageSeconds})
        .then(() => {
            let embed = client.botMessage.messageActionSuccess('ban')
            interaction.reply({ embeds:[embed], ephemeral:true })
            .then((message) => {setTimeout(() => {message.delete()},client.botCommandDeleteTime)})
            .catch(() => {return})
        })
        .catch(() => {
            let embed = client.botMessage.messageBotError()
            interaction.reply({ embeds:[embed], ephemeral:true })
            .then((message) => {setTimeout(() => {message.delete()},client.botCommandDeleteTime)})
            .catch(() => {return})
        }) 
    }
}