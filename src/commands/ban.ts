import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import Client from '../client'

const SlashCommand = new SlashCommandBuilder()
.setName('ban')
.setDescription('banir o membro do servidor')
.addUserOption(Option =>
    Option
    .setName('user')
    .setDescription('o usuário a ser expulso')
    .setRequired(true)
)
.addStringOption(Option => 
    Option
    .setName('reason')
    .setDescription('o motivo pela qual o usuário vai ser expulso')
    .setRequired(false)
)
.addNumberOption(Option =>
    Option
    .setName('days')
    .setDescription('quantos dias a pessoa vai ficar banida')
    .setRequired(false)
)
.addNumberOption(Option =>
    Option
    .setName('hours')
    .setDescription('quantas horas a pessoa vai ficar banida')
    .setRequired(false)
)
.addNumberOption(Option =>
    Option
    .setName('minutes')
    .setDescription('quantos minutos a pessoa vai ficar banida')
    .setRequired(false)
)

export default {
    data:SlashCommand,
    async execute (interaction:ChatInputCommandInteraction<any>, client:Client) {

        let embed = new EmbedBuilder()
        .setAuthor({ name:interaction.user.username, iconURL:interaction.user.displayAvatarURL()})
        .setTimestamp()

        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            embed
            .setColor('Red')
            .setTitle('❌ Permissão negada Membro ❌')
            .setDescription('permissão necessária: banir membro')

            interaction.reply({ embeds:[embed], ephemeral:true })
            return
        }

        let userOption = interaction.options.getUser('user', true)
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

        let daysOption = interaction.options.getNumber('days', false) || 0
        let hoursOption = interaction.options.getNumber('hours', false) || 0
        let minutesOption = interaction.options.getNumber('minutes', false) || 0

        let seconds = 0
        seconds += minutesOption * 60
        seconds += hoursOption * 3600
        seconds += daysOption * 86400

        let reason = `o ${interaction.user.username}#${interaction.user.discriminator} me pediu para banir o ${user.user.username}. tempo:${seconds == 0?'indeterminado':`dias:${daysOption} horas:${hoursOption}, minutos:${minutesOption}`}, o motivos foi: ${reasonOption || ''}`

        user.ban({reason:reason, deleteMessageSeconds:seconds == 0?undefined:seconds})
        .then((user) => {
            embed
            .setColor('Green')
            .setTitle('✅ Sucesso ✅')
            .setThumbnail(user.user.displayAvatarURL())
            .setDescription(`o ${user.user.username} foi banida(o) com sucesso`)

            interaction.reply({ embeds:[embed], ephemeral:true })
            return
        })
        .catch(() => {
            embed
            .setColor('Red')
            .setTitle('❌ Permissão negada Bot ❌')
            .setDescription('eu não tenho permissão para banir esse membro')

            interaction.reply({ embeds:[embed], ephemeral:true })
        }) 
    }
}