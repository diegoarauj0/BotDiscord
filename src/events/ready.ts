import discord from 'discord.js'
import Client from '../client'

export default (bot:discord.Client<true>, client:Client): discord.Awaitable<void> => {
    console.log(`${bot.user.username} ligado`)
}