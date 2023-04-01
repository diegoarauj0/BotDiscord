import { EmbedBuilder, User, PermissionsString, ChatInputCommandInteraction, Collection, APIEmbedField, LocaleString } from 'discord.js'
import { Command } from '../types/discord'

type Action = 'ban' | 'kick' | 'clear' | 'unban' | 'setChannelName' | 'setGuildName' | 'setNickname' | 'createChannel'

class CommandsMessage {

    public embed:EmbedBuilder = new EmbedBuilder()
    private interactionUser?:User
    private targetUser?:User
    private reason?:string
    private messageNumber?:number
    private oldName?:string
    private newName?:string
    private interaction?:ChatInputCommandInteraction<any>
    private commands?:Collection<string, Command>
    private languages?:LocaleString

    constructor() {

    }

    set setInteractionUser(user:User | undefined) {
        this.interactionUser = user
    }

    set setCommands(commands:Collection<string, Command>) {
        this.commands = commands
    }

    set setLocale(language:LocaleString) {
        this.languages = language
    }

    set setInteraction(interaction:ChatInputCommandInteraction<any>) {
        this.interaction = interaction
    }

    set setTargetUser(user:User | undefined) {
        this.targetUser = user
    }

    set setReason(reason:string | undefined) {
        this.reason = reason
    }
    
    set setMessageNumber(message:number | undefined) {
        this.messageNumber = message
    }
    
    set setOldName(name:string | undefined) {
        this.oldName = name
    }

    set setNewName(name:string | undefined) {
        this.newName = name
    }

    public resetValue(): void {
        this.embed = new EmbedBuilder()
        this.interactionUser = undefined
        this.targetUser = undefined
        this.reason = undefined
        this.messageNumber = undefined
        this.oldName = undefined
        this.newName = undefined
    }

    private embedDefault(success:boolean): void {
        this.embed
        .setTimestamp()
        .setThumbnail('https://i.ibb.co/G586fDS/incorrect.png')
        .setColor('Red')
        if (success) {
            this.embed
            .setThumbnail('https://i.ibb.co/xM6QhYm/correct.png')
            .setColor('Green')
        }
    }

    private embedAuthor(): void {
        if (!this.interactionUser) return
        this.embed
        .setAuthor({ name:`${this.interactionUser.username}#${this.interactionUser.discriminator}`, iconURL:this.interactionUser.displayAvatarURL({ forceStatic:false })})
    }

    public embedPermissionDenied(permission:PermissionsString, author:'bot' | 'member'): void {

        this.embedDefault(false)
        this.embedAuthor()

       this.embed
        .setTitle(`👮‍♂️|${author == 'bot'?'eu não tenho':'você não tem'} permissão para executar esse comando|👮‍♂️`)
        .setDescription(`**permissão necessária ➡️ | ${permission} |**`)
    }

    public embedUnable(unable:'bannable' | 'kickable' | 'moderatable'): void {

        this.embedDefault(false)
        this.embedAuthor()

        let description:{[key:string]:string} = {
            bannable:'não posso | ➡️🚪 **banir** ➡️🚪 | esse usuário, provavelmente ele tem um cargo maior do que eu',
            kickable:'não posso | ➡️🚪 **expulsar** ➡️🚪 | esse usuário, provavelmente ele tem um cargo maior do que eu',
            moderatable:'não posso | 🧑‍💻 **gerenciar** 🧑‍💻 | esse usuário, provavelmente ele tem um cargo maior do que eu'
        }

        this.embed
        .setTitle('👮‍♂️ | não tenho permissão para executar esse comando | 👮‍♂️')
        .setDescription(`**${description[unable]}**`)
    }

    public embedNotFound(item:string): void {
        this.embedDefault(false)
        this.embedAuthor()

        this.embed
        .setTitle('🤷 | não foi encontrado | 🤷')
        .setDescription(`**o(a) ${item} não foi encontrado(a)**`)
    }

    public embedBotError(): void {
        this.embedDefault(false)
        this.embedAuthor()

        this.embed
        .setTitle('😵‍💫 | bot confuso | 😵‍💫')
        .setDescription('**não foi possível finalizar seu comando devido um error não identificado**')
    }

    public embedHelp(): void {
        if (!this.commands) return
        if (!this.languages) return
        this.embedDefault(true)
        this.embedAuthor()
        let fields:Array<APIEmbedField> = []
        this.commands.map((command) => {
            fields.push({
                name:`/${command.data.name_localizations?.[this.languages || 'en-US'] || command.data.name}`,
                value:command.data.description_localizations?.[this.languages || 'en-US'] || command.data.description
            })
        })
        this.embed
        .setTitle('Lista de comandos')
        .setFields(fields)
    }

    private converteNumberEmojis(number:number | undefined): string {

        if (!number) {return ''}
        let array = String(number).split('')
        let result = ''
        let emojiDictionary:{[key:string]:string,} = {
            '0':'0️⃣',
            '1':'1️⃣',
            '2':'2️⃣',
            '3':'3️⃣',
            '4':'4️⃣',
            '5':'5️⃣',
            '6':'6️⃣',
            '7':'7️⃣',
            '8':'8️⃣',
            '9':'9️⃣'
        }
        for (let a in array) {
            result += emojiDictionary[array[a]]
        }
        return result
    }

    private setActionTranslate(): {[key:string]:{success:{title:string, description:string},error:{title:string, description:string}}} {
        let actionTranslate:{[key:string]:{success:{title:string, description:string},error:{title:string, description:string}}} = {}

        let interactionUsername = `${this.interactionUser?.username}#${this.interactionUser?.discriminator}`
        let targetUsername = `${this.targetUser?.username}#${this.targetUser?.discriminator}`

        actionTranslate['ban'] = {success:{
            description:`
                ➡️ membro banido: ${targetUsername} 🚪\n
                ➡️ membro que baniu: ${interactionUsername} 👮‍♂️\n
                ➡️ motivo: ${this.reason || 'não definido'} 📝
            `,
            title:'membro foi banido com sucesso'
        },error:{
            description:'devido um a erro desconhecido não foi possível banir esse membro',
            title:'não foi possível banir esse membro'
        }}
        actionTranslate['kick'] = {success:{
            description:`
                ➡️ membro expulso: ${targetUsername} 🚪\n
                ➡️ membro que expulsor: ${interactionUsername} 👮‍♂️\n
                ➡️ motivo: ${this.reason || 'não definido'} 📝
            `,
            title:'membro foi expulso com sucesso'
        },error:{
            description:'devido a um erro desconhecido não foi possível expulsar esse membro',
            title:'não foi possível expulsar esse membro'
        }}
        actionTranslate['clear'] = {success:{
            description:`
            ➡️ mensagem apagadas: ${this.converteNumberEmojis(this.messageNumber)} 🟢\n
            ➡️ membro que executor o comando: ${interactionUsername} 👮
            `,
            title:'chat foi limpo com sucesso'
        },error:{
            description:'devido a um erro desconhecido não foi possível apaga as mensagens',
            title:'não foi possível apaga as mensagens'
        }}
        actionTranslate['unban'] = {success:{
            description:`
                ➡️ membro desBanido: ${targetUsername} 🚪\n
                ➡️ membro que desBaniu: ${interactionUsername} 👮‍♂️\n
                ➡️ motivo: ${this.reason || 'não definido'} 📝
            `,
            title:'membro foi desBanindo com sucesso'
        },error:{
            description:'devido a um erro desconhecido não foi possível desbanir esse membro',
            title:'não foi possível desbanir esse membro'
        }}
        actionTranslate['setChannelName'] = {success:{
            description:`
                ➡️ nome antigo: ${this.oldName} 🔴\n
                ➡️ nome novo: ${this.newName} 🟢\n
                ➡️ membro que executor o comando: ${interactionUsername} 👮‍♂️\n
                ➡️ motivo: ${this.reason || 'não definido'} 📝
            `,
            title:'nome do canal foi alterado com sucesso'
        },error:{
            description:'devido a um erro desconhecido não foi possível alterar o nome desse canal',
            title:'não foi possível alterar o nome desse canal'
        }}
        actionTranslate['setGuildName'] = {success:{
            description:`
                ➡️ nome antigo: ${this.oldName} 🔴\n
                ➡️ nome novo: ${this.newName} 🟢\n
                ➡️ membro que executor o comando: ${interactionUsername} 👮‍♂️\n
                ➡️ motivo: ${this.reason || 'não definido'} 📝
            `,
            title:'nome do servidor foi alterado com sucesso'
        },error:{
            description:'devido a um erro desconhecido não foi possível alterar o nome desse servidor',
            title:'não foi possível alterar o nome desse servidor'
        }}
        actionTranslate['setNickname'] = {success:{
            description:`
                ➡️ apelido antigo: ${this.oldName} 🔴\n
                ➡️ apelido novo: ${this.newName} 🟢\n
                ➡️ membro que executor o comando: ${interactionUsername} 👮‍♂️\n
                ➡️ motivo: ${this.reason || 'não definido'} 📝
            `,
            title:'apelido do membro foi alterado com sucesso'
        },error:{
            description:'devido a um erro desconhecido não foi possível alterar o apelido desse membro',
            title:'não foi possível alterar o apelido desse membro'
        }}
        actionTranslate['createChannel'] = {success:{
            description:`
                ➡️ nome do canal: ${this.newName} 🟢\n
                ➡️ membro que executor o comando: ${interactionUsername} 👮‍♂️\n
                ➡️ motivo: ${this.reason || 'não definido'} 📝
            `,
            title:'canal foi criado com sucesso'
        },error:{
            description:'devido a um erro desconhecido não foi criar um novo canal',
            title:'não foi possível criar um novo canal'
        }}

        return actionTranslate
    }

    public embedAction(success:boolean, action:Action): void {
        this.embedDefault(success)
        this.embedAuthor()

        if (this.targetUser && success) {
            this.embed
            .setThumbnail(this.targetUser.displayAvatarURL({ forceStatic:false }))
        }

        let actionTranslate = this.setActionTranslate()

        this.embed
        .setTitle(success?`✅ ${actionTranslate[action].success.title} ✅`:`❌ ${actionTranslate[action].error.title} ❌`)
        .setDescription(success?`**${actionTranslate[action].success.description}**`:`**${actionTranslate[action].error.description}**`)
    }

    public send( ephemeral:boolean,deleteMessage:boolean,time?:number): Promise<boolean> {
        return new Promise(async (resolve) => {
            if (!this.interaction) {resolve(false);return}
            await this.interaction.reply({ embeds:[this.embed], ephemeral:ephemeral})
            .then((message) => {
                if (deleteMessage) {
                    setTimeout(() => {
                        message.delete().catch(() => {return})
                    },time || 10000)
                }
                resolve(true)
            })
            .catch(() => {resolve(false)})
        })
    }
}

export default CommandsMessage