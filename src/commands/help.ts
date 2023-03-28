import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, EmbedBuilder, APIEmbedField, RestOrArray } from 'discord.js'
import Client from '../client'
import discord from 'discord.js'

const SlashCommand = new SlashCommandBuilder()
.setName('help')
.setDescription('show command list')
.setDescriptionLocalizations({
    'pt-BR':'mostrar lista comandos'
})

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