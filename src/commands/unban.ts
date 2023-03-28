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
.addUserOption(Option =>
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

        let userId = interaction.options.getString('userid', true)
        let reasonOption = interaction.options.getString('reason')

        await interaction.guild.bans.fetch()
        .then(async (bans) => {
            let user = bans.get(userId)
            if (!user) {
                embed
                .setColor('Red')
                .setTitle('❌ não encontrado ❌')
                .setDescription('não consigo encontrar esse usuário na lista de banimentos')
    
                interaction.reply({ embeds:[embed], ephemeral:true })
                
                return
            }

            let reason = `o ${interaction.user.username}#${interaction.user.discriminator} me pediu para desBanir o ${user.user.username} o motivos foi: ${reasonOption || ''}`

            interaction.guild.members.unban(user.user.id,reason)
            .then(() => {
                embed
                .setColor('Green')
                .setTitle('✅ Sucesso ✅')

                if (user) {
                    embed
                    .setThumbnail(user.user.displayAvatarURL())
                    .setDescription(`o ${user.user.username} foi desBanido com sucesso`)
                }
    
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
        })
    }
}