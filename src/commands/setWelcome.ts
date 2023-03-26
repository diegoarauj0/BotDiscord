import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import Client from '../client'
import { guildModel } from '../models/guild'

const SlashCommand = new SlashCommandBuilder()
.setName('set_welcome')
.addChannelOption(option => 
    option
    .setName('channel')
    .setDescription('id ou nome do canal onde o mensagem vai ser enviada')
    .setRequired(true)
)
.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
.setDescription('definir uma mensagem de boas vindas')

export default {
    data:SlashCommand,
    async execute (interaction:ChatInputCommandInteraction<CacheType>, client:Client) {

        let getChannel = interaction.options.getChannel('channel',true)
        let embed = new EmbedBuilder()
        .setTimestamp()
        .setAuthor({ name:interaction.user.username, iconURL:interaction.user.displayAvatarURL() })

        let channel = interaction.guild?.channels.cache.filter(channel => {return channel.id == getChannel.id}).get(getChannel.id)

        if (!channel) {
            embed.setColor('Red')
            embed.setTitle('Canal não encontrado')
            embed.setDescription('não foi possível encontrar esse canal😥\nMotivos:\n1:canal não existe\n2:canal foi removido\n3:eu não tenho permissão para ver esse canal')
            interaction.reply({ embeds:[ embed ] })
            return
        }

        if (!interaction.guildId) {
            embed.setColor('Red')
            embed.setTitle('Permissão negada')
            embed.setDescription('eu não tenho permissão para ver o id do servidor/canal')
            interaction.reply({ embeds:[ embed ] })
            return
        }
        
        try {
            let guild = await guildModel.findOne({guildId:interaction.guildId})
            if (!guild) {
                embed.setColor('Red')
                embed.setTitle('Servidor não encontrado')
                embed.setDescription('eu não consigo encontrar as configuração desse servidor no meu banco de dados.\nSolução: me expulsar e depois me adicionar no servidor, pode arrumar esse problema')
                interaction.reply({ embeds:[ embed ] })
                return
            }
    
            guild.welcomeChannelId = channel.id
            await guild.save()
    
            embed.setColor('Green')
            embed.setTitle('Sucesso')
            embed.setDescription(`o ${channel.name} foi definido como canal de boas vidas`)
    
            interaction.reply({ embeds:[ embed ] })
        } catch {
            embed.setColor('Red')
            embed.setTitle('Problema Desconhecido')
            embed.setDescription('infelizmente não posso executar esse comando por um Problema Desconhecido')
            interaction.reply({ embeds:[ embed ] })
        }

    }
}