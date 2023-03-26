import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, EmbedBuilder, APIEmbedField, RestOrArray } from 'discord.js'
import Client from '../client'
import discord from 'discord.js'

const SlashCommand = new SlashCommandBuilder()
.setName('help')
.setDescription('mostrar todos os comandos do bot')

export default {
    data:SlashCommand,
    async execute (interaction:ChatInputCommandInteraction<CacheType>, client:Client) {

        let fields:Array<APIEmbedField> = []
        client.botCommands.map((value) => {
            fields.push({ name: `/${value.data.name}`, value: value.data.description, inline: false })
        })

        let embed = new EmbedBuilder()
        .setAuthor({ name:interaction.user.username, iconURL:interaction.user.displayAvatarURL()})
        .setTimestamp()
        .setColor('Green')
        .setTitle('Lista de Comandos')
        .setFields(fields)
        interaction.reply({ embeds:[embed] })
    }
}