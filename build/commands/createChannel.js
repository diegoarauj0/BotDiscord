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
const SlashCommand = new discord_js_1.SlashCommandBuilder()
    .setName('add_channel')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageChannels)
    .setNameLocalizations({
    "en-US": 'add_channel',
    'pt-BR': 'add_canal'
})
    .setDescription('create new channel')
    .setDescriptionLocalizations({
    'pt-BR': 'criar um novo canal',
    'en-US': 'create new channel'
})
    .addStringOption(Option => Option
    .setName('name')
    .setNameLocalizations({
    'en-US': 'name',
    'pt-BR': 'nome'
})
    .setDescription('new guild name')
    .setDescriptionLocalizations({
    'en-US': 'new guild name',
    'pt-BR': 'novo nome do servidor'
})
    .setRequired(true))
    .addNumberOption(Option => Option
    .setName('type')
    .setNameLocalizations({
    'en-US': 'type',
    'pt-BR': 'tipo'
})
    .setDescription('channel type')
    .setDescriptionLocalizations({
    'en-US': 'channel type',
    'pt-BR': 'tipo do canal'
})
    .setChoices({ name: 'voiceChannel', value: 2, name_localizations: {
        'en-US': 'voiceChannel',
        'pt-BR': 'canalVoz'
    } }, { name: 'textChannel', value: 0, name_localizations: {
        'en-US': 'textChannel',
        'pt-BR': 'canalTexto'
    } })
    .setRequired(true))
    .addBooleanOption(Option => Option
    .setName('nsfw')
    .setNameLocalizations({
    'en-US': 'nsfw',
    'pt-BR': 'nsfw'
})
    .setDescription('nsfw channel?')
    .setDescriptionLocalizations({
    'en-US': 'nsfw channel?',
    'pt-BR': 'o canal e seguro para todas idade? (eu acho que isso que significa nsfw ;-;)'
})
    .setRequired(false))
    .addNumberOption(Option => Option
    .setName('user_limit')
    .setNameLocalizations({
    'en-US': 'user_limit',
    'pt-BR': 'limite_usuário'
})
    .setDescription('user limit')
    .setDescriptionLocalizations({
    'en-US': 'user limit',
    'pt-BR': 'limite de usuário'
})
    .setMinValue(0)
    .setRequired(false))
    .addStringOption(Option => Option
    .setName('topic')
    .setNameLocalizations({
    'en-US': 'topic',
    'pt-BR': 'tópico'
})
    .setDescription('channel topic')
    .setDescriptionLocalizations({
    'en-US': 'channel topic',
    'pt-BR': 'tópico do canal'
})
    .setMaxLength(1024)
    .setMinLength(1)
    .setRequired(false))
    .addStringOption(Option => Option
    .setName('reason')
    .setNameLocalizations({
    'pt-BR': 'motivo',
    'en-US': 'reason'
})
    .setDescription('reason for the ban')
    .setDescriptionLocalizations({
    'pt-BR': 'motivo do banimento',
    'en-US': 'reason for the ban'
})
    .setRequired(false));
exports.default = {
    data: SlashCommand,
    execute(interaction, client) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = interaction.appPermissions) === null || _a === void 0 ? void 0 : _a.has('ManageChannels'))) {
                client.commandsMessage.embedPermissionDenied('ManageChannels', 'bot');
                client.commandsMessage.send(true, true);
                return;
            }
            if (!interaction.memberPermissions.has('ManageChannels')) {
                client.commandsMessage.embedPermissionDenied('ManageChannels', 'member');
                client.commandsMessage.send(true, true);
                return;
            }
            let nameOption = interaction.options.getString('name', true);
            let nsfwOption = interaction.options.getBoolean('nsfw', false);
            let typeOption = interaction.options.getNumber('type', true);
            let topicOption = interaction.options.getString('topic', false);
            let reasonOption = interaction.options.getString('reason', false);
            let userLimitOption = interaction.options.getNumber('user_limit', false);
            let guild = interaction.guild;
            let reason = `
        quem crio o canal: ${interaction.user.username}#${interaction.user.discriminator}👮‍♂️\n
        nome: ${interaction.user.username}#${interaction.user.discriminator}📝\n
        motivo: ${reasonOption || 'não definido'} 📝
        `;
            client.commandsMessage.setReason = reasonOption || undefined;
            client.commandsMessage.setNewName = nameOption;
            guild.channels.create({
                name: nameOption,
                reason: reason,
                parent: (_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.parentId,
                nsfw: nsfwOption || false,
                type: typeOption,
                userLimit: userLimitOption || undefined,
                topic: topicOption || undefined,
            })
                .then(() => {
                client.commandsMessage.embedAction(true, 'createChannel');
                client.commandsMessage.send(true, false);
            })
                .catch(() => {
                client.commandsMessage.embedAction(false, 'createChannel');
                client.commandsMessage.send(true, true);
            });
        });
    }
};
