import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, EmbedBuilder } from 'discord.js'
import Client from '../client'
import discord from 'discord.js'

const SlashCommand = new SlashCommandBuilder()
.setName('ping')
.setNameLocalizations({
    "en-US":'ping',
    'pt-BR':'ping'
})
.setDescription('return "pong"')
.setDescriptionLocalizations({
    'pt-BR':'retornar "pong"',
    'en-US':'return "pong"'
})

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