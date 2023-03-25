import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, EmbedBuilder } from 'discord.js'
import Client from '../client'

const SlashCommand = new SlashCommandBuilder()
.setName('ping')
.setDescription('mostrar o ping')

export default {
    data:SlashCommand,
    async execute (interaction:ChatInputCommandInteraction<CacheType>, client:Client) {
        let embed = new EmbedBuilder()
        .setAuthor({ name:interaction.user.username, iconURL:interaction.user.displayAvatarURL()})
        .setTimestamp()
        .setColor('Green')
        .setTitle('Pong 🏓')
        interaction.reply({ embeds:[embed] })
    }
}