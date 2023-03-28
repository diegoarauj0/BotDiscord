import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import Client from '../client'

const SlashCommand = new SlashCommandBuilder()
.setName('clear')
.setNameLocalizations({
    'pt-BR':'clear'
})
.setDescription('clear messages from a channel')
.setDescriptionLocalizations({
    'pt-BR':'limpar mensagens de um canal'
})
.addNumberOption(Option =>
    Option
    .setName('amount')
    .setNameLocalizations({
        'pt-BR':'quantos'
    })
    .setDescription('amount of message to clear')
    .setDescriptionLocalizations({
        'pt-BR':'quantidade de mensagem para deletar'
    })
    .setMaxValue(100)
    .setMinValue(1)
    .setRequired(true)
)

export default {
    data:SlashCommand,
    async execute (interaction:ChatInputCommandInteraction<any>, client:Client) {

        let embed = new EmbedBuilder()
        .setAuthor({ name:interaction.user.username, iconURL:interaction.user.displayAvatarURL()})
        .setTimestamp()

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            embed
            .setColor('Red')
            .setTitle('❌ Permissão negada Membro ❌')
            .setDescription('permissão necessária: gerenciar mensagem')

            interaction.reply({ embeds:[embed], ephemeral:true })
            return
        }

        let messageNumber = interaction.options.getNumber('amount', true)

        let channel = interaction.channel

        if (!channel) {
            embed
            .setColor('Red')
            .setTitle('❌ Permissão negada Bot ❌')
            .setDescription('eu não tenho permissão para alterar/ver o canal')

            interaction.reply({ embeds:[embed], ephemeral:true })
            return
        }

        await channel.bulkDelete(messageNumber).catch(() => {return})

        embed
        .setColor('Green')
        .setTitle('✅ Sucesso ✅')
        .setDescription('Mensagem Apagada com sucesso')

        interaction.reply({ embeds:[embed] })
        .then((message) => {
            setTimeout(() => {
                message.delete()
            },5000)
        })
        .catch(() => {return})   
    }
}