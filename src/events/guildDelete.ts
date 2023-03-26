import discord from 'discord.js'
import Client from '../client'
import { guildModel } from '../models/guild'

export default (guild:discord.Guild, client:Client): void => {
    
    guildModel.findOneAndRemove({ guildId:guild.id }).catch(() => {return})
}