import Client from "./client"
import { _ID, _TOKEN } from './config/discord.json'

const client = new Client(_TOKEN, _ID) 
client.start()