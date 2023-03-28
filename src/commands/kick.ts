import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import Client from '../client'

const SlashCommand = new SlashCommandBuilder()
.setName('kick')
.setDescription('expulsar o membro do servidor')
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
export default {
    data:SlashCommand,
    async execute (interaction:ChatInputCommandInteraction<any>, client:Client) {

        client.botMessage.languages = interaction.locale
        client.botMessage.user = interaction.user

        if (!interaction.appPermissions?.has('KickMembers')) {
            let embed = client.botMessage.messageBotPermission('KickMembers')
            interaction.reply({ embeds:[embed], ephemeral:true })
            .then((message) => {setTimeout(() => {message.delete()},client.botCommandDeleteTime)})
            .catch(() => {return})
            return
        }

        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            let embed = client.botMessage.messageUserPermission('KickMembers')
            interaction.reply({ embeds:[embed], ephemeral:true })
            .then((message) => {setTimeout(() => {message.delete()},client.botCommandDeleteTime)})
            .catch(() => {return})
            return
        }

        let userOption = interaction.options.getUser('member', true)
        let reasonOption = interaction.options.getString('reason')

        let member = interaction.guild.members.cache.get(userOption.id)

        if (!member) {
            let embed = client.botMessage.messageNotFound('member')
            interaction.reply({ embeds:[embed], ephemeral:true })
            .then((message) => {setTimeout(() => {message.delete()},client.botCommandDeleteTime)})
            .catch(() => {return})
            return
        }

        let reason = `${interaction.user.username}#${interaction.user.discriminator} => ${member.user.username}#${member.user.discriminator}: ${reasonOption || ''}`

        member.kick(reason)
        .then((member) => {
            client.botMessage.target = member.user

            let embed = client.botMessage.messageActionSuccess('kick')
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