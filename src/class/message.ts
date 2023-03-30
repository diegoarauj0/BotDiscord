import { PermissionsString, EmbedBuilder, LocaleString, User, Collection, APIEmbedField } from 'discord.js'
import { Command } from '../types/discord'

interface TranslateActive {
    [key:string]:string | undefined,
    'pt-BR':string,
    'en-US':string
}

type DiscordType = 'member' | 'channel'
type Action = 'ban' | 'kick' | 'clear' | 'unban' | 'setChannelName' | 'setGuildName' | 'setNickname'
type LoadingType = 'botLoading'
type AbleType = 'bannable' | 'kickable' | 'moderatable'

class Message {

    public languages:LocaleString = 'en-US'
    private permissionTranslateObject:{[key:string]:TranslateActive} = {}
    private discordTranslateObject:{[key:string]:TranslateActive} = {}
    private actionTranslateObject:{[key:string]:TranslateActive} = {}
    private loadingTranslateObject:{[key:string]:TranslateActive} = {}
    private ableTranslateObject:{[key:string]:TranslateActive} = {}
    public user?:User
    public target?:User

    constructor() {
        this.permissionTranslateObject = {
            BanMembers:{
                "en-US":'ban members',
                'pt-BR':'banir membros'
            },
            KickMembers: {
                'en-US':'kick members',
                'pt-BR':'expulsar membros'
            },
            ManageMessages: {
                'en-US':'manage messages',
                'pt-BR':'gerenciar mensagem'
            },
            ManageChannels: {
                'en-US':'manage channels',
                'pt-BR':'gerenciar canal'
            },
            ManageGuild: {
                'en-US':'manage guild',
                'pt-BR':'gerenciar servidor'
            },
            ManageNicknames: {
                'en-US':'manage nicknames',
                'pt-BR':'gerenciar apelidos'
            }
        }
        this.discordTranslateObject = {
            guild:{
                'en-US':'guild',
                'pt-BR':'servidor'
            },
            channel:{
                'en-US':'channel',
                'pt-BR':'canal'
            },
            member:{
                'en-US':'member',
                'pt-BR':'membro'
            }
        }
    }

    private permissionTranslate(permission:PermissionsString): string {
        return this.permissionTranslateObject[permission][this.languages] || this.permissionTranslateObject[permission]['en-US']
    }

    private discordTranslate(discord:DiscordType): string {
        return this.discordTranslateObject[discord][this.languages] || this.discordTranslateObject[discord]['en-US']
    }

    private createEmbed(err:boolean): EmbedBuilder {
        let embed = new EmbedBuilder()
        .setColor('Green')
        .setThumbnail('https://i.ibb.co/xM6QhYm/correct.png')
        if (this.user) {
            embed
            .setTimestamp()
            .setFooter({ iconURL:this.user.displayAvatarURL(), text:`${this.user.username}#${this.user.discriminator}`})
        }
        if (err) {
            embed
            .setThumbnail('https://i.ibb.co/G586fDS/incorrect.png')
            .setColor('Red')
        }
        return embed
    }

    public messageLoading(loadingType:LoadingType): EmbedBuilder {

        this.loadingTranslateObject = {
            botLoading: {
                'en-US':'the bot is loading...',
                'pt-BR':'o bot estar carregando...'
            }
        }

        let titleTranslate:TranslateActive = {
            "en-US":'Loading',
            'pt-BR':'Carregando'
        }

        let embed = this.createEmbed(false)
        .setTitle(`✅ ${titleTranslate[this.languages] || titleTranslate['en-US']} ✅`)
        .setDescription(this.loadingTranslateObject[loadingType][this.languages] || this.loadingTranslateObject[loadingType]['en-US'])

        return embed
    }

    public messageUserPermission(permission:PermissionsString): EmbedBuilder {

        let titleTranslate:TranslateActive = {
            "en-US":'Permission denied member',
            'pt-BR':'permissão negada membro'
        }

        let descriptionTranslate:TranslateActive = {
            "en-US":`permission require: ${this.permissionTranslate(permission)}`,
            'pt-BR':`permissão necessária: ${this.permissionTranslate(permission)}`
        }

        let embed = this.createEmbed(true)
        .setTitle(`❌ ${titleTranslate[this.languages] || titleTranslate['en-US']} ❌`)
        .setDescription(descriptionTranslate[this.languages] || descriptionTranslate['en-US'])

        return embed
    }

    public messageBotPermission(permission:PermissionsString): EmbedBuilder {

        let titleTranslate:TranslateActive = {
            "en-US":'Permission denied bot',
            'pt-BR':'permissão negada bot'
        }

        let descriptionTranslate:TranslateActive = {
            "en-US":`permission require: ${this.permissionTranslate(permission)}`,
            'pt-BR':`permissão necessária: ${this.permissionTranslate(permission)}`
        }

        let embed = this.createEmbed(true)
        .setTitle(`❌ ${titleTranslate[this.languages] || titleTranslate['en-US']} ❌`)
        .setDescription(descriptionTranslate[this.languages] || descriptionTranslate['en-US'])

        return embed
    }

    public messageAble(action:AbleType): EmbedBuilder {

        let titleTranslate:TranslateActive = {
            "en-US":'Permission denied bot',
            'pt-BR':'permissão negada bot'
        }

        this.ableTranslateObject = {
            bannable: {
                "en-US":"I can't ban this user",
                'pt-BR':'não posso banir esse usuário, provavelmente ele tem um cargo maior do que eu'
            },
            kickable: {
                "en-US":"I can't kick this user",
                'pt-BR':'não posso expulsar esse usuário, provavelmente ele tem um cargo maior do que eu'
            },
            moderatable: {
                "en-US":"I can't manage this user",
                'pt-BR':'não posso gerenciar esse usuário, provavelmente ele tem um cargo maior do que eu'
            }
        }

        let embed = this.createEmbed(true)
        .setTitle(`❌ ${titleTranslate[this.languages] || titleTranslate['en-US']} ❌`)
        .setDescription(this.ableTranslateObject[action][this.languages] || this.ableTranslateObject[action]['en-US'])

        return embed
    }

    public messageHelp(commands:Collection<string, Command>): EmbedBuilder {

        let titleTranslate:TranslateActive = {
            "en-US":'list of commands',
            'pt-BR':'Lista de comandos'
        }

        let fields:Array<APIEmbedField> = []
        commands.map((command) => {
            fields.push({
                name:`/${command.data.name_localizations?.[this.languages] || command.data.name}`,
                value:command.data.description_localizations?.[this.languages] || command.data.description
            })
        })
        let embed = this.createEmbed(false)
        .setTitle(`${titleTranslate[this.languages] || titleTranslate['en-US']}`)
        .setFields(fields)

        return embed
    }

    public messageNotFound(discordType:DiscordType): EmbedBuilder {

        let titleTranslate:TranslateActive = {
            "en-US":'Not Found',
            'pt-BR':'Não encontrado'
        }

        let descriptionTranslate:TranslateActive = {
            "en-US":`this ${this.discordTranslate(discordType)} was not found`,
            'pt-BR':`esse ${this.discordTranslate(discordType)} não foi encontrado`
        }

        let embed = this.createEmbed(true)
        .setTitle(`❌ ${titleTranslate[this.languages] || titleTranslate['en-US']} ❌`)
        .setDescription(descriptionTranslate[this.languages] || descriptionTranslate['en-US'])

        return embed
    }

    public messageBotError(): EmbedBuilder {

        let titleTranslate:TranslateActive = {
            "en-US":'bot error',
            'pt-BR':'bot confuso'
        }

        let descriptionTranslate:TranslateActive = {
            "en-US":`Your command could not be terminated due to an unknown error`,
            'pt-BR':'não foi possível finalizar seu comando devido um error não identificado'
        }

        let embed = this.createEmbed(true)
        .setTitle(`❌ ${titleTranslate[this.languages] || titleTranslate['en-US']} ❌`)
        .setDescription(descriptionTranslate[this.languages] || descriptionTranslate['en-US'])

        return embed
    }

    public messageActionSuccess(action:Action): EmbedBuilder {

        this.actionTranslateObject = {
            ban: {
                'en-US':`successfully banned ${!this.target?'':`${this.target.username}#${this.target.discriminator}`}`,
                'pt-BR':`o ${!this.target?'membro':`${this.target.username}#${this.target.discriminator}`} foi banido com sucesso`
            },
            kick: {
                'en-US':`successfully kicked ${!this.target?'':`${this.target.username}#${this.target.discriminator}`}`,
                'pt-BR':`o ${!this.target?'membro':`${this.target.username}#${this.target.discriminator}`} foi expulso com sucesso`
            },
            unban: {
                'en-US':`successfully unbanned ${!this.target?'':`${this.target.username}#${this.target.discriminator}`}`,
                'pt-BR':`o ${!this.target?'membro':`${this.target.username}#${this.target.discriminator}`} foi desBanido com sucesso`
            },
            clear: {
                'en-US':'successfully deleted message',
                'pt-BR':'mensagem apagada com sucesso'
            },
            setChannelName: {
                'en-US':'channel name has been successfully changed',
                'pt-BR':'nome do canal foi alterado com sucesso'
            },
            setGuildName: {
                'en-US':'guild name has been successfully changed',
                'pt-BR':'nome do servidor foi alterado com sucesso'
            },
            setNickname: {
                'en-US':'nickname changed successfully',
                'pt-BR':'apelido alterado com sucesso'
            }
        }

        let titleTranslate:TranslateActive = {
            "en-US":'Success',
            'pt-BR':'Sucesso'
        }

        let embed = this.createEmbed(false)
        .setTitle(`✅ ${titleTranslate[this.languages] || titleTranslate['en-US']} ✅`)
        .setDescription(this.actionTranslateObject[action][this.languages] || this.actionTranslateObject[action]['en-US'])
        if (this.target) {
            embed.setThumbnail(this.target.displayAvatarURL())
        }

        return embed
    }
}

export default Message