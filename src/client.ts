import discord from 'discord.js'
import fs from 'fs/promises'
import path from 'path'
import Status from './class/status'
import connect from './database/mongoose'
import { Command } from './types/discord'

class Client extends discord.Client {

    private botToken:string
    private botId:string
    public botCommands:discord.Collection<string, Command> = new discord.Collection()
    private REST:discord.REST
    private botStatus:discord.Collection<string, {text:string, Activity:discord.ActivityOptions}> = new discord.Collection

    constructor(token:string, id:string) {
        super({intents:[ 'GuildModeration', 'Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent', 'GuildMessageTyping', 'DirectMessages' ]})
        this.botId = id
        this.botToken = token
        this.REST = new discord.REST({ version:'10' }).setToken(this.botToken)
    }

    public start(): Promise<void> {
        return new Promise(async (resolve,reject) => {
            try {
                await connect()
                await this.loadCommands()
                await this.loadEvents()
                await this.startBot()
                this.loadStatus()
                resolve()
            } catch(reason) {
                reject(reason)
            }
        })
    }

    private loadCommands(): Promise<void> {
        return new Promise((resolve,reject) => {
            console.log('--Comandos--')
            fs.readdir(path.join(`${__dirname}/commands`))
            .then(async (commandsFile) => {
                let body:Array<any> = []
                for (let c in commandsFile) {
                    try {
                        const slashCommand = await Import(`./commands/${commandsFile[c]}`)
                        this.botCommands.set(slashCommand.data.name,slashCommand)
                        body.push(slashCommand.data.toJSON())
                        console.log(`${commandsFile[c]}: ok`)
                    } catch(reason) {
                        console.log(`${commandsFile} error:${reason}`)
                    } 
                }
                await this.REST.put(discord.Routes.applicationCommands(this.botId),{body:body}).catch((reason) => {reject(reason)})
                console.log('--Comandos--')
                resolve()
            })
            .catch((reason) => {
                reject(reason)
            })
        })

        function Import(url:string): Promise<Command> {
            return new Promise(async (resolve, reject) => {
                try {
                    const importedFile = await import(url)
                    resolve(importedFile.default)

                } catch(reason) {
                    reject(reason)
                }
            })
        }
    }

    private loadEvents(): Promise<void> {
        return new Promise((resolve,reject) => {
            console.log('--Eventos--')
            fs.readdir(path.join(`${__dirname}/events`))
            .then(async (eventsFile) => {
                for (let e in eventsFile) {
                    try {
                        const eventFunc = await Import(`./events/${eventsFile[e]}`)
                        this.on(path.parse(eventsFile[e]).name, (eventParameter) => {
                            eventFunc(eventParameter, this)
                        })
                        console.log(`${eventsFile[e]}: ok`)
                    } catch(reason) {
                        console.log(`${eventsFile} error:${reason}`)
                    }
                }
                resolve()
                console.log('--Eventos--')
            })
            .catch((reason) => {
                reject(reason)
            })
        })

        function Import(url:string): Promise<(event:any, client:Client) => discord.Awaitable<void>> {
            return new Promise(async (resolve, reject) => {
                try {
                    const importedFile = await import(url)
                    resolve(importedFile.default)

                } catch(reason) {
                    reject(reason)
                }
            })
        }
    }

    private loadStatus(): void {
        this.botStatus.set('1',{ text:'o servidor', Activity:{type:discord.ActivityType.Watching} })
        this.botStatus.set('2',{ text:'Programar esse bot ta dificil em...', Activity:{type:discord.ActivityType.Watching}})
        this.botStatus.set('3',{ text:'boa noite', Activity:{type:discord.ActivityType.Watching} })
        this.botStatus.set('4',{ text:'no ceu tem pão', Activity:{type:discord.ActivityType.Watching} })
        console.log('--Status--')
        console.log('AVISO:(esse status vai ser publico para qualquer pessoa ver, se você colocar coisa erradas o discord pode banir sua conta)')
        this.botStatus.forEach((value) => {
            console.log(`o status "${value.text}" foi adicionado ao bot`)
        })
        console.log('--Status--')
        let statusRandom = this.botStatus.random()
        if (statusRandom) {this.user?.setActivity(statusRandom?.text, statusRandom?.Activity);console.log(`O status "${statusRandom.text}" do tipo "${statusRandom.Activity.type?.toString() || ''}" esta ativado nesse momento`)}
        setInterval(() => {
            statusRandom = this.botStatus.random()
            if (statusRandom) {this.user?.setActivity(statusRandom?.text, statusRandom?.Activity);console.log(`O status "${statusRandom.text}" do tipo "${statusRandom.Activity.type?.toString() || ''}" esta ativado nesse momento`)}
        },600000)
    }

    private startBot(): Promise<void> {
        return new Promise(async (resolve,reject) => {
            await this.login(this.botToken).catch((reason) => {reject(reason)})
            resolve()
        })
    }
}
export default Client