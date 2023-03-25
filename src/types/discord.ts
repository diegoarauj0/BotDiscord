import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from 'discord.js'
import Client from '../client'

export interface Command {
    data:SlashCommandBuilder,
    execute: (interaction:ChatInputCommandInteraction<CacheType>, client:Client) => Promise<void>
}