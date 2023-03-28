import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import Client from '../client'

const SlashCommand = new SlashCommandBuilder()
.setName('unban')
.setNameLocalizations({
    'pt-BR':'desbanir'
})
.setDescription('unban a user from the server')
.setDescriptionLocalizations({
    'pt-BR':'desbanir um usuário do servidor'
})
.addStringOption(Option =>
    Option
    .setName('userid')
    .setNameLocalizations({
        'pt-BR':'iduser'
    })
    .setDescription('ID of the user your want to unban')
    .setDescriptionLocalizations({
        'pt-BR':'ID do usuário que você deseja desbanir'
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

        if (!interaction.appPermissions?.has('BanMembers')) {
            client.replyCommand(client.botMessage.messageBotPermission('BanMembers'), interaction)
            return
        }

        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            client.replyCommand(client.botMessage.messageUserPermission('BanMembers'), interaction)
            return
        }

        let userIdOption = interaction.options.getString('userid', true)
        let reasonOption = interaction.options.getString('reason')

        await interaction.guild.bans.fetch()
        .then(async (bans) => {
            let userBan = bans.get(userIdOption)
            if (!userBan) {
                client.replyCommand(client.botMessage.messageNotFound('member'), interaction)
                return
            }
            let user = userBan.user

            let reason = `${interaction.user.username}#${interaction.user.discriminator} => ${user.username}: ${reasonOption || ''}`

            interaction.guild.members.unban(user.id,reason)
            .then(() => {
                client.botMessage.target = user
                client.replyCommand(client.botMessage.messageActionSuccess('unban'),interaction)
                return
            })
            .catch(() => {
                client.replyCommand(client.botMessage.messageBotError(),interaction)
                return
            })
        })
        .catch(() => {
            client.replyCommand(client.botMessage.messageBotError(),interaction)
        })
    }
}