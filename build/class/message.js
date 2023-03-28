"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class Message {
    constructor() {
        this.languages = 'en-US';
        this.permissionTranslateObject = {};
        this.discordTranslateObject = {};
        this.actionTranslateObject = {};
        this.permissionTranslateObject = {
            BanMembers: {
                "en-US": 'ban members',
                'pt-BR': 'banir membros'
            },
            KickMembers: {
                'en-US': 'kick members',
                'pt-BR': 'expulsar membros'
            },
            ManageMessages: {
                'en-US': 'manage messages',
                'pt-BR': 'gerenciar mensagem'
            }
        };
        this.discordTranslateObject = {
            guild: {
                'en-US': 'guild',
                'pt-BR': 'servidor'
            },
            channel: {
                'en-US': 'channel',
                'pt-BR': 'canal'
            },
            member: {
                'en-US': 'member',
                'pt-BR': 'membro'
            }
        };
    }
    permissionTranslate(permission) {
        return this.permissionTranslateObject[permission][this.languages] || this.permissionTranslateObject[permission]['en-US'];
    }
    discordTranslate(discord) {
        return this.discordTranslateObject[discord][this.languages] || this.discordTranslateObject[discord]['en-US'];
    }
    createEmbed(err) {
        let embed = new discord_js_1.EmbedBuilder()
            .setColor('Green')
            .setThumbnail('https://i.ibb.co/xM6QhYm/correct.png');
        if (this.user) {
            embed
                .setTimestamp()
                .setFooter({ iconURL: this.user.displayAvatarURL(), text: `${this.user.username}#${this.user.discriminator}` });
        }
        if (err) {
            embed
                .setThumbnail('https://i.ibb.co/G586fDS/incorrect.png')
                .setColor('Red');
        }
        return embed;
    }
    messageUserPermission(permission) {
        let titleTranslate = {
            "en-US": 'Permission denied member',
            'pt-BR': 'permissão negada membro'
        };
        let descriptionTranslate = {
            "en-US": `permission require: ${this.permissionTranslate(permission)}`,
            'pt-BR': `permissão necessária: ${this.permissionTranslate(permission)}`
        };
        let embed = this.createEmbed(true)
            .setTitle(`❌ ${titleTranslate[this.languages] || titleTranslate['en-US']} ❌`)
            .setDescription(descriptionTranslate[this.languages] || descriptionTranslate['en-US']);
        return embed;
    }
    messageBotPermission(permission) {
        let titleTranslate = {
            "en-US": 'Permission denied bot',
            'pt-BR': 'permissão negada bot'
        };
        let descriptionTranslate = {
            "en-US": `permission require: ${this.permissionTranslate(permission)}`,
            'pt-BR': `permissão necessária: ${this.permissionTranslate(permission)}`
        };
        let embed = this.createEmbed(true)
            .setTitle(`❌ ${titleTranslate[this.languages] || titleTranslate['en-US']} ❌`)
            .setDescription(descriptionTranslate[this.languages] || descriptionTranslate['en-US']);
        return embed;
    }
    messageBannableOrkickable(action) {
        let titleTranslate = {
            "en-US": 'Permission denied bot',
            'pt-BR': 'permissão negada bot'
        };
        let descriptionTranslate = {
            "en-US": `I can't ${action == 'kickable' ? 'kick' : 'ban'} this user`,
            'pt-BR': `não posso ${action == 'kickable' ? 'expulsar' : 'banir'} esse usuário, provavelmente ele tem um cargo maior do que eu`
        };
        let embed = this.createEmbed(true)
            .setTitle(`❌ ${titleTranslate[this.languages] || titleTranslate['en-US']} ❌`)
            .setDescription(descriptionTranslate[this.languages] || descriptionTranslate['en-US']);
        return embed;
    }
    messageHelp(commands) {
        let titleTranslate = {
            "en-US": 'list of commands',
            'pt-BR': 'Lista de comandos'
        };
        let fields = [];
        commands.map((command) => {
            var _a, _b;
            fields.push({
                name: `/${((_a = command.data.name_localizations) === null || _a === void 0 ? void 0 : _a[this.languages]) || command.data.name}`,
                value: ((_b = command.data.description_localizations) === null || _b === void 0 ? void 0 : _b[this.languages]) || command.data.description
            });
        });
        let embed = this.createEmbed(false)
            .setTitle(`${titleTranslate[this.languages] || titleTranslate['en-US']}`)
            .setFields(fields);
        return embed;
    }
    messageNotFound(discordType) {
        let titleTranslate = {
            "en-US": 'Not Found',
            'pt-BR': 'Não encontrado'
        };
        let descriptionTranslate = {
            "en-US": `this ${this.discordTranslate(discordType)} was not found`,
            'pt-BR': `esse ${this.discordTranslate(discordType)} não foi encontrado`
        };
        let embed = this.createEmbed(true)
            .setTitle(`❌ ${titleTranslate[this.languages] || titleTranslate['en-US']} ❌`)
            .setDescription(descriptionTranslate[this.languages] || descriptionTranslate['en-US']);
        return embed;
    }
    messageBotError() {
        let titleTranslate = {
            "en-US": 'bot error',
            'pt-BR': 'bot confuso'
        };
        let descriptionTranslate = {
            "en-US": `Your command could not be terminated due to an unknown error`,
            'pt-BR': 'não foi possível finalizar seu comando devido um error não identificado'
        };
        let embed = this.createEmbed(true)
            .setTitle(`❌ ${titleTranslate[this.languages] || titleTranslate['en-US']} ❌`)
            .setDescription(descriptionTranslate[this.languages] || descriptionTranslate['en-US']);
        return embed;
    }
    messageActionSuccess(action) {
        this.actionTranslateObject = {
            ban: {
                'en-US': `successfully banned ${!this.target ? '' : `${this.target.username}#${this.target.discriminator}`}`,
                'pt-BR': `o ${!this.target ? 'membro' : `${this.target.username}#${this.target.discriminator}`} foi banido com sucesso`
            },
            kick: {
                'en-US': `successfully kicked ${!this.target ? '' : `${this.target.username}#${this.target.discriminator}`}`,
                'pt-BR': `o ${!this.target ? 'membro' : `${this.target.username}#${this.target.discriminator}`} foi expulso com sucesso`
            },
            unban: {
                'en-US': `successfully unbanned ${!this.target ? '' : `${this.target.username}#${this.target.discriminator}`}`,
                'pt-BR': `o ${!this.target ? 'membro' : `${this.target.username}#${this.target.discriminator}`} foi desBanido com sucesso`
            },
            clear: {
                'en-US': 'successfully deleted message',
                'pt-BR': 'mensagem apagada com sucesso'
            }
        };
        let titleTranslate = {
            "en-US": 'Success',
            'pt-BR': 'Sucesso'
        };
        let embed = this.createEmbed(false)
            .setTitle(`✅ ${titleTranslate[this.languages] || titleTranslate['en-US']} ✅`)
            .setDescription(this.actionTranslateObject[action][this.languages] || this.actionTranslateObject[action]['en-US']);
        if (this.target) {
            embed.setThumbnail(this.target.displayAvatarURL());
        }
        return embed;
    }
}
exports.default = Message;
