import { SlashCommandBuilder, ChatInputCommandInteraction, Guild, EmbedBuilder } from 'discord.js'
import Client from '../client'

const SlashCommand = new SlashCommandBuilder()
.setName('set_guild_name')
.setNameLocalizations({
    "en-US":'set_guild_name',
    'pt-BR':'definir_nome_servidor'
})
.setDescription('change guild name')
.setDescriptionLocalizations({
    'pt-BR':'alterar o nome do servidor',
    'en-US':'change guild name'
})
.addStringOption(Option =>
    Option
    .setName('name')
    .setNameLocalizations({
        'en-US':'name',
        'pt-BR':'nome'
    })
    .setDescription('new guild name')
    .setDescriptionLocalizations({
        'en-US':'new guild name',
        'pt-BR':'novo nome do servidor'
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

        if (!interaction.appPermissions?.has('ManageGuild')) {
            client.commandsMessage.embedPermissionDenied('ManageGuild', 'bot')
            client.commandsMessage.send(true,true)
            return
        }

        if (!interaction.memberPermissions.has('ManageGuild')) {
            client.commandsMessage.embedPermissionDenied('ManageGuild', 'member')
            client.commandsMessage.send(true,true)
            return
        }

        let nameOption = interaction.options.getString('name',true)
        let reasonOption = interaction.options.getString('reason',true)
        let guild:Guild = interaction.guild
        let reason = `
        quem altero o nome do servidor: ${interaction.user.username}#${interaction.user.discriminator}👮‍♂️\n
        nome antigo: ${guild?.name}➡️🚪\n
        nome novo: ${nameOption}📝\n
        motivo: ${reasonOption}📝
        `

        client.commandsMessage.setReason = reasonOption || undefined
        client.commandsMessage.setNewName = nameOption
        client.commandsMessage.setOldName = guild.name

        guild.setName(nameOption, reason)
        .then(() => {
            client.commandsMessage.embedAction(true,'setGuildName')
            client.commandsMessage.send(true,false)
        })
        .catch(() => {
            client.commandsMessage.embedAction(false,'setGuildName')
            client.commandsMessage.send(true,true)
        })
    }
}