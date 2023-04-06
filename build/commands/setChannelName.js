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
    .setName('change_channel_name')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageChannels)
    .setNameLocalizations({
    "en-US": 'change_channel_name',
    'pt-BR': 'alterar_nome_canal'
})
    .setDescription('change channel name')
    .setDescriptionLocalizations({
    'pt-BR': 'alterar o nome do canal',
    'en-US': 'change channel name'
})
    .addStringOption(Option => Option
    .setName('name')
    .setNameLocalizations({
    'en-US': 'name',
    'pt-BR': 'nome'
})
    .setDescription('new channel name')
    .setDescriptionLocalizations({
    'en-US': 'new channel name',
    'pt-BR': 'novo nome do canal'
})
    .setRequired(true))
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
        var _a;
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
            let reasonOption = interaction.options.getString('reason', false);
            let channel = interaction.channel;
            let reason = `
        quem altero o nome do canal: ${interaction.user.username}#${interaction.user.discriminator}👮‍♂️\n
        nome antigo: ${channel === null || channel === void 0 ? void 0 : channel.name}➡️🚪\n
        nome novo: ${nameOption}📝\n
        motivo:${reasonOption || 'não definido'}📝
        `;
            client.commandsMessage.setReason = reasonOption || undefined;
            client.commandsMessage.setNewName = nameOption;
            client.commandsMessage.setOldName = channel === null || channel === void 0 ? void 0 : channel.name;
            channel === null || channel === void 0 ? void 0 : channel.setName(nameOption, reason).then(() => {
                client.commandsMessage.embedAction(true, 'setChannelName');
                client.commandsMessage.send(true, false);
            }).catch(() => {
                client.commandsMessage.embedAction(false, 'setChannelName');
                client.commandsMessage.send(true, true);
            });
        });
    }
};
