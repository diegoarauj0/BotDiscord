"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class CommandsMessage {
    constructor() {
        this.embed = new discord_js_1.EmbedBuilder();
    }
    set setInteractionUser(user) {
        this.interactionUser = user;
    }
    set setCommands(commands) {
        this.commands = commands;
    }
    set setLocale(language) {
        this.languages = language;
    }
    set setInteraction(interaction) {
        this.interaction = interaction;
    }
    set setTargetUser(user) {
        this.targetUser = user;
    }
    set setReason(reason) {
        this.reason = reason;
    }
    set setMessageNumber(message) {
        this.messageNumber = message;
    }
    set setOldName(name) {
        this.oldName = name;
    }
    set setNewName(name) {
        this.newName = name;
    }
    resetValue() {
        this.embed = new discord_js_1.EmbedBuilder();
        this.interactionUser = undefined;
        this.targetUser = undefined;
        this.reason = undefined;
        this.messageNumber = undefined;
        this.oldName = undefined;
        this.newName = undefined;
    }
    embedDefault(success) {
        this.embed
            .setTimestamp()
            .setThumbnail('https://i.ibb.co/G586fDS/incorrect.png')
            .setColor('Red');
        if (success) {
            this.embed
                .setThumbnail('https://i.ibb.co/xM6QhYm/correct.png')
                .setColor('Green');
        }
    }
    embedAuthor() {
        if (!this.interactionUser)
            return;
        this.embed
            .setAuthor({ name: `${this.interactionUser.username}#${this.interactionUser.discriminator}`, iconURL: this.interactionUser.displayAvatarURL({ forceStatic: false }) });
    }
    embedPermissionDenied(permission, author) {
        this.embedDefault(false);
        this.embedAuthor();
        this.embed
            .setTitle(`👮‍♂️|${author == 'bot' ? 'não tenho' : 'você não tem'} permissão para executar esse comando|👮‍♂️`)
            .setDescription(`**permissão necessária ➡️ | ${permission} |**`);
    }
    embedUnable(unable) {
        this.embedDefault(false);
        this.embedAuthor();
        let description = {
            bannable: 'não posso | ➡️🚪 **banir** ➡️🚪 | esse usuário, provavelmente ele tem um cargo maior do que eu',
            kickable: 'não posso | ➡️🚪 **expulsar** ➡️🚪 | esse usuário, provavelmente ele tem um cargo maior do que eu',
            moderatable: 'não posso | 🧑‍💻 **gerenciar** 🧑‍💻 | esse usuário, provavelmente ele tem um cargo maior do que eu'
        };
        this.embed
            .setTitle('👮‍♂️ | não tenho permissão para executar esse comando | 👮‍♂️')
            .setDescription(`**${description[unable]}**`);
    }
    embedNotFound(item) {
        this.embedDefault(false);
        this.embedAuthor();
        this.embed
            .setTitle('🤷 | não foi encontrado | 🤷')
            .setDescription(`**o(a) ${item} não foi encontrado(a)**`);
    }
    embedBotError() {
        this.embedDefault(false);
        this.embedAuthor();
        this.embed
            .setTitle('😵‍💫 | bot confuso | 😵‍💫')
            .setDescription('**não foi possível finalizar seu comando devido um error não identificado**');
    }
    embedHelp() {
        if (!this.commands)
            return;
        if (!this.languages)
            return;
        this.embedDefault(true);
        this.embedAuthor();
        let fields = [];
        this.commands.map((command) => {
            var _a, _b;
            fields.push({
                name: `/${((_a = command.data.name_localizations) === null || _a === void 0 ? void 0 : _a[this.languages || 'en-US']) || command.data.name}`,
                value: ((_b = command.data.description_localizations) === null || _b === void 0 ? void 0 : _b[this.languages || 'en-US']) || command.data.description
            });
        });
        this.embed
            .setTitle('Lista de comandos')
            .setFields(fields);
    }
    converteNumberEmojis(number) {
        if (!number) {
            return '';
        }
        let array = String(number).split('');
        let result = '';
        let emojiDictionary = {
            '0': '0️⃣',
            '1': '1️⃣',
            '2': '2️⃣',
            '3': '3️⃣',
            '4': '4️⃣',
            '5': '5️⃣',
            '6': '6️⃣',
            '7': '7️⃣',
            '8': '8️⃣',
            '9': '9️⃣'
        };
        for (let a in array) {
            result += emojiDictionary[array[a]];
        }
        return result;
    }
    setActionTranslate() {
        var _a, _b, _c, _d;
        let actionTranslate = {};
        let interactionUsername = `${(_a = this.interactionUser) === null || _a === void 0 ? void 0 : _a.username}#${(_b = this.interactionUser) === null || _b === void 0 ? void 0 : _b.discriminator}`;
        let targetUsername = `${(_c = this.targetUser) === null || _c === void 0 ? void 0 : _c.username}#${(_d = this.targetUser) === null || _d === void 0 ? void 0 : _d.discriminator}`;
        actionTranslate['ban'] = { success: {
                description: `
                ➡️ membro banido: ${targetUsername} 🚪\n
                ➡️ membro que baniu: ${interactionUsername} 👮‍♂️\n
                ➡️ motivo: ${this.reason || 'não definido'} 📝
            `,
                title: 'membro foi banido com sucesso'
            }, error: {
                description: 'devido um a erro desconhecido não foi possível banir esse membro',
                title: 'não foi possível banir esse membro'
            } };
        actionTranslate['kick'] = { success: {
                description: `
                ➡️ membro expulso: ${targetUsername} 🚪\n
                ➡️ membro que expulsor: ${interactionUsername} 👮‍♂️\n
                ➡️ motivo: ${this.reason || 'não definido'} 📝
            `,
                title: 'membro foi expulso com sucesso'
            }, error: {
                description: 'devido a um erro desconhecido não foi possível expulsar esse membro',
                title: 'não foi possível expulsar esse membro'
            } };
        actionTranslate['clear'] = { success: {
                description: `
            ➡️ mensagem apagadas: ${this.converteNumberEmojis(this.messageNumber)} 🟢\n
            ➡️ membro que executor o comando: ${interactionUsername} 👮
            `,
                title: 'chat foi limpo com sucesso'
            }, error: {
                description: 'devido a um erro desconhecido não foi possível apaga as mensagens',
                title: 'não foi possível apaga as mensagens'
            } };
        actionTranslate['unban'] = { success: {
                description: `
                ➡️ membro desBanido: ${targetUsername} 🚪\n
                ➡️ membro que desBaniu: ${interactionUsername} 👮‍♂️\n
                ➡️ motivo: ${this.reason || 'não definido'} 📝
            `,
                title: 'membro foi desBanindo com sucesso'
            }, error: {
                description: 'devido a um erro desconhecido não foi possível desbanir esse membro',
                title: 'não foi possível desbanir esse membro'
            } };
        actionTranslate['setChannelName'] = { success: {
                description: `
                ➡️ nome antigo: ${this.oldName} 🔴\n
                ➡️ nome novo: ${this.newName} 🟢\n
                ➡️ membro que executor o comando: ${interactionUsername} 👮‍♂️\n
                ➡️ motivo: ${this.reason || 'não definido'} 📝
            `,
                title: 'nome do canal foi alterado com sucesso'
            }, error: {
                description: 'devido a um erro desconhecido não foi possível alterar o nome desse canal',
                title: 'não foi possível alterar o nome desse canal'
            } };
        actionTranslate['setGuildName'] = { success: {
                description: `
                ➡️ nome antigo: ${this.oldName} 🔴\n
                ➡️ nome novo: ${this.newName} 🟢\n
                ➡️ membro que executor o comando: ${interactionUsername} 👮‍♂️\n
                ➡️ motivo: ${this.reason || 'não definido'} 📝
            `,
                title: 'nome do servidor foi alterado com sucesso'
            }, error: {
                description: 'devido a um erro desconhecido não foi possível alterar o nome desse servidor',
                title: 'não foi possível alterar o nome desse servidor'
            } };
        actionTranslate['setNickname'] = { success: {
                description: `
                ➡️ apelido antigo: ${this.oldName} 🔴\n
                ➡️ apelido novo: ${this.newName} 🟢\n
                ➡️ membro que executor o comando: ${interactionUsername} 👮‍♂️\n
                ➡️ motivo: ${this.reason || 'não definido'} 📝
            `,
                title: 'apelido do membro foi alterado com sucesso'
            }, error: {
                description: 'devido a um erro desconhecido não foi possível alterar o apelido desse membro',
                title: 'não foi possível alterar o apelido desse membro'
            } };
        actionTranslate['createChannel'] = { success: {
                description: `
                ➡️ nome do canal: ${this.newName} 🟢\n
                ➡️ membro que executor o comando: ${interactionUsername} 👮‍♂️\n
                ➡️ motivo: ${this.reason || 'não definido'} 📝
            `,
                title: 'canal foi criado com sucesso'
            }, error: {
                description: 'devido a um erro desconhecido não foi possível criar um novo canal',
                title: 'não foi possível criar um novo canal'
            } };
        actionTranslate['removeChannel'] = { success: {
                description: `
            ➡️ nome do canal: ${this.oldName} 🟢\n
            ➡️ membro que executor o comando: ${interactionUsername} 👮‍♂️\n
            ➡️ motivo: ${this.reason || 'não definido'} 📝
            `,
                title: 'canal foi removido com sucesso'
            }, error: {
                description: 'devido a um erro desconhecido não foi possível remover o canal',
                title: 'não foi possível remover o canal'
            } };
        return actionTranslate;
    }
    embedAction(success, action) {
        this.embedDefault(success);
        this.embedAuthor();
        if (this.targetUser && success) {
            this.embed
                .setThumbnail(this.targetUser.displayAvatarURL({ forceStatic: false }));
        }
        let actionTranslate = this.setActionTranslate();
        this.embed
            .setTitle(success ? `✅ ${actionTranslate[action].success.title} ✅` : `❌ ${actionTranslate[action].error.title} ❌`)
            .setDescription(success ? `**${actionTranslate[action].success.description}**` : `**${actionTranslate[action].error.description}**`);
    }
    send(ephemeral, deleteMessage, time) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (!this.interaction) {
                resolve(false);
                return;
            }
            yield this.interaction.reply({ embeds: [this.embed], ephemeral: ephemeral })
                .then((message) => {
                if (deleteMessage) {
                    setTimeout(() => {
                        message.delete().catch(() => { return; });
                    }, time || 10000);
                }
                resolve(true);
            })
                .catch(() => { resolve(false); });
        }));
    }
}
exports.default = CommandsMessage;
