import discord from 'discord.js'
import Client from '../client'
import { guildModel } from '../models/guild'

export default (member:discord.GuildMember, client:Client): discord.Awaitable<void> => {
    guildModel.findOne({ guildId:member.guild.id })
    .then((Guild) => {
        if (!Guild) return
        if (!Guild.welcomeChannelId) return
        let channel = member.guild.channels.cache.get(Guild.welcomeChannelId) as discord.GuildBasedChannel & { send:(option:discord.MessageCreateOptions | string) => void } | undefined
        if (!channel) return

        let embed = new discord.EmbedBuilder()
        .setAuthor({ name:member.user.username, iconURL:member.user.displayAvatarURL() })
        .setTimestamp()
        .setColor('Random')
        .setTitle(`Ola ${member.user.username} seja bem-vindo`)
        .setImage('https://media3.giphy.com/media/4ilFRqgbzbx4c/200.gif')
        .setThumbnail(member.user.displayAvatarURL())

        channel.send({embeds:[ embed ]})

    })
}