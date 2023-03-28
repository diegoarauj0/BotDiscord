import discord from 'discord.js'
import Client from '../client'
import { guildModel } from '../models/guild'

export default (guild:discord.Guild, client:Client): void => {
    
    guildModel.findOne({guildId:guild.id})
    .then((Guild) => {
        if (!Guild) {
            guildModel.create({
                guildId:guild.id
            }).catch(() => {return})
        }
    })
    .catch(() => {
        guildModel.create({
            guildId:guild.id
        }).catch(() => {return})
    })
}