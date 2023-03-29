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

export default {
    data:SlashCommand,
    async execute (interaction:ChatInputCommandInteraction<any>, client:Client) {

        if (!interaction.appPermissions?.has('ManageGuild')) {
            client.replyCommand(client.botMessage.messageBotPermission('ManageGuild'), interaction, true)
            return
        }

        if (!interaction.memberPermissions?.has('ManageGuild')) {
            client.replyCommand(client.botMessage.messageUserPermission('ManageGuild'), interaction, true)
            return
        }

        let nameOption = interaction.options.getString('name',true)
        let guild:Guild = interaction.guild

        guild.setName(nameOption, `${interaction.member.user.username}#${interaction.member.user.discriminator}`)
        .then(() => {
            client.replyCommand(client.botMessage.messageActionSuccess('setGuildName'), interaction, true)
            return
        })
        .catch(() => {
            client.replyCommand(client.botMessage.messageBotError(), interaction, true)
        })
    }
}