import { SlashCommandBuilder, ChatInputCommandInteraction, GuildTextBasedChannel, EmbedBuilder } from 'discord.js'
import Client from '../client'

const SlashCommand = new SlashCommandBuilder()
.setName('set_nickname')
.setNameLocalizations({
    "en-US":'set_nickname',
    'pt-BR':'definir_apelido'
})
.setDescription('change nickname')
.setDescriptionLocalizations({
    'pt-BR':'alterar apelido',
    'en-US':'change nickname'
})
.addStringOption(Option =>
    Option
    .setName('nickname')
    .setNameLocalizations({
        'en-US':'nickname',
        'pt-BR':'apelido'
    })
    .setDescription('new nickname')
    .setDescriptionLocalizations({
        'en-US':'new nickname',
        'pt-BR':'novo apelido'
    })
    .setMaxLength(32)
    .setRequired(true)
)
.addUserOption(Option =>
    Option
    .setName('member')
    .setNameLocalizations({
        'pt-BR':'membro',
        'en-US':'member'
    })
    .setDescription('member')
    .setDescriptionLocalizations({
        'pt-BR':'membro',
        'en-US':'member'
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

        if (!interaction.appPermissions?.has('ManageNicknames')) {
            client.commandsMessage.embedPermissionDenied('ManageNicknames', 'bot')
            client.commandsMessage.send(true,true)
            return
        }

        if (!interaction.memberPermissions.has('ManageNicknames')) {
            client.commandsMessage.embedPermissionDenied('ManageNicknames', 'member')
            client.commandsMessage.send(true,true)
            return
        }

        let nicknameOption = interaction.options.getString('nickname',true)
        let memberOption = interaction.options.getUser('member',true)
        let member = interaction.guild.members.cache.get(memberOption.id)
        let reasonOption = interaction.options.getString('reason',false)

        if (!member) {
            client.commandsMessage.embedNotFound('membro')
            client.commandsMessage.send(true,true)
            return
        }
        let reason = `
        quem altero o apelido: ${interaction.user.username}#${interaction.user.discriminator}👮‍♂️\n
        nome antigo: ${member.user.username}➡️🚪\n
        nome novo: ${nicknameOption}📝\n
        motivo: ${reasonOption || 'não definido'}📝
        `

        client.commandsMessage.setReason = reasonOption || undefined
        client.commandsMessage.setNewName = nicknameOption
        client.commandsMessage.setOldName = member.nickname || undefined
        client.commandsMessage.setTargetUser = member.user
        
        member.setNickname(nicknameOption,reason)
        .then(() => {
            client.commandsMessage.embedAction(true,'setNickname')
            client.commandsMessage.send(true,false)
        })
        .catch(() => {
            client.commandsMessage.embedAction(false,'setNickname')
            client.commandsMessage.send(true,true)
        })
    }
}