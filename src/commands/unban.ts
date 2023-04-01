import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import Client from '../client'

const SlashCommand = new SlashCommandBuilder()
.setName('unban')
.setNameLocalizations({
    'pt-BR':'desbanir',
    'en-US':'unban'
})
.setDescription('unban a user from the server')
.setDescriptionLocalizations({
    'pt-BR':'desbanir um usuário do servidor',
    'en-US':'unban a user from the server'
})
.addStringOption(Option =>
    Option
    .setName('userid')
    .setNameLocalizations({
        'pt-BR':'iduser',
        'en-US':'userid'
    })
    .setDescription('ID of the user your want to unban')
    .setDescriptionLocalizations({
        'pt-BR':'ID do usuário que você deseja desbanir',
        'en-US':'ID of the user your want to unban'
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

        let userIdOption = interaction.options.getString('userid', true)
        let reasonOption = interaction.options.getString('reason')

        await interaction.guild.bans.fetch()
        .then(async (bans) => {
            let userBan = bans.get(userIdOption)
            if (!userBan) {
                client.commandsMessage.embedNotFound('membro')
                client.commandsMessage.send(true,true)
                return
            }
            let user = userBan.user

            let reason = `
            membro que desbaniu: ${interaction.user.username}#${interaction.user.discriminator}👮‍♂️\n
            membro desbanido: ${user.username}#${user.discriminator}➡️🚪\n
            motivo: ${reasonOption || 'não definido'}📝
            `

            client.commandsMessage.setTargetUser = userBan.user

            interaction.guild.members.unban(user.id,reason)
            .then(() => {
                client.commandsMessage.embedAction(true,'unban')
                client.commandsMessage.send(true,false)
            })
            .catch(() => {
                client.commandsMessage.embedAction(false,'unban')
                client.commandsMessage.send(true,true)
            })
        })
        .catch(() => {
            client.replyCommand(client.botMessage.messageBotError(),interaction,true)
        })
    }
}