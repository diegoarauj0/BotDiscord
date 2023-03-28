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

        let embed = new EmbedBuilder()
        .setAuthor({ name:interaction.user.username, iconURL:interaction.user.displayAvatarURL()})
        .setTimestamp()

        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            embed
            .setColor('Red')
            .setTitle('❌ Permissão negada Membro ❌')
            .setDescription('permissão necessária: expulsar membro')

            interaction.reply({ embeds:[embed], ephemeral:true })
            return
        }

        let userOption = interaction.options.getUser('member', true)
        let reasonOption = interaction.options.getString('reason')

        let user = interaction.guild.members.cache.get(userOption.id)

        if (!user) {
            embed
            .setColor('Red')
            .setTitle('❌ não encontrado ❌')
            .setDescription('não consigo encontrar esse usuário')

            interaction.reply({ embeds:[embed], ephemeral:true })
            return
        }

        let reason = `o ${interaction.user.username}#${interaction.user.discriminator} me pediu para expulsar o ${user.user.username}, o motivos foi: ${reasonOption || ''}`

        user.kick(reason)
        .then((user) => {
            embed
            .setColor('Green')
            .setTitle('✅ Sucesso ✅')
            .setThumbnail(user.user.displayAvatarURL())
            .setDescription(`o ${user.user.username} foi expulso com sucesso`)

            interaction.reply({ embeds:[embed], ephemeral:true })
            return
        })
        .catch(() => {
            embed
            .setColor('Red')
            .setTitle('❌ Permissão negada Bot ❌')
            .setDescription('eu não tenho permissão para expulsar esse membro')

            interaction.reply({ embeds:[embed], ephemeral:true })
        }) 
    }
}