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
        'pt-BR':'membros',
        'en-US':'member'
    })
    .setDescription('member')
    .setDescriptionLocalizations({
        'pt-BR':'membro',
        'en-US':'member'
    })
    .setRequired(true)
)

export default {
    data:SlashCommand,
    async execute (interaction:ChatInputCommandInteraction<any>, client:Client) {

        if (!interaction.appPermissions?.has('ManageNicknames')) {
            client.replyCommand(client.botMessage.messageBotPermission('ManageNicknames'), interaction, true)
            return
        }

        if (!interaction.memberPermissions?.has('ManageNicknames')) {
            client.replyCommand(client.botMessage.messageUserPermission('ManageNicknames'), interaction, true)
            return
        }

        let nicknameOption = interaction.options.getString('nickname',true)
        let memberOption = interaction.options.getUser('member',true)
        let member = interaction.guild.members.cache.get(memberOption.id)

        if (!member) {
            client.replyCommand(client.botMessage.messageNotFound('member'), interaction, true)
            return
        }

        member.setNickname(nicknameOption,`${interaction.member.user.username}#${interaction.member.user.discriminator}`)
        .then(() => {
            client.replyCommand(client.botMessage.messageActionSuccess('setNickname'), interaction, true)
        })
        .catch(() => {
            client.replyCommand(client.botMessage.messageBotError(), interaction, true)
        })
    }
}