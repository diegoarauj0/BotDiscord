import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import Client from '../client'

const SlashCommand = new SlashCommandBuilder()
.setName('clear')
.setDescription('deletar as mensagem do chat')
.addNumberOption(Option =>
    Option
    .setName('mensagem_numero')
    .setDescription('quantas mensagem vão ser excluídas')
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

        let messageNumber = interaction.options.getNumber('mensagem_numero', true)

        if (messageNumber < 1) {
            embed
            .setColor('Red')
            .setTitle('❌ Opção invalida ❌')
            .setDescription('o numero de mensagem precisa ser maior do que 1')

            interaction.reply({ embeds:[embed], ephemeral:true })
            return
        }

        if (messageNumber > 100) {
            embed
            .setColor('Red')
            .setTitle('❌ Opção invalida ❌')
            .setDescription('o numero de mensagem precisa ser menor do que 100')

            interaction.reply({ embeds:[embed], ephemeral:true })
            return
        }

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