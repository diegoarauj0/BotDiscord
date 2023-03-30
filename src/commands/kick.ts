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
            client.replyCommand(client.botMessage.messageBotPermission('KickMembers'), interaction,true)
            return
        }

        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            client.replyCommand(client.botMessage.messageUserPermission('KickMembers'), interaction,true)
            return
        }

        let userOption = interaction.options.getUser('member', true)
        let reasonOption = interaction.options.getString('reason')
        let member = interaction.guild.members.cache.get(userOption.id)

        if (!member) {
            client.replyCommand(client.botMessage.messageNotFound('member'),interaction,true)
            return
        }

        if (!member.kickable) {
            client.replyCommand(client.botMessage.messageAble('kickable'), interaction,true)
            return
        }

        let reason = `${interaction.user.username}#${interaction.user.discriminator} => ${member.user.username}#${member.user.discriminator}: ${reasonOption || ''}`

        member.kick(reason)
        .then((member) => {
            client.botMessage.target = member.user
            client.replyCommand(client.botMessage.messageActionSuccess('kick'),interaction,true)
        })
        .catch(() => {
            client.replyCommand(client.botMessage.messageBotError(),interaction,true)
        }) 
    }
}