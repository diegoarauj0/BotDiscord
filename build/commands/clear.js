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
    .setName('clear')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageMessages)
    .setNameLocalizations({
    'pt-BR': 'clear',
    'en-US': 'clear'
})
    .setDescription('clear messages from a channel')
    .setDescriptionLocalizations({
    'pt-BR': 'limpar mensagens de um canal',
    'en-US': 'clear messages from a channel'
})
    .addNumberOption(Option => Option
    .setName('amount')
    .setNameLocalizations({
    'pt-BR': 'quantos',
    'en-US': 'amount'
})
    .setDescription('amount of message to clear')
    .setDescriptionLocalizations({
    'pt-BR': 'quantidade de mensagem para deletar',
    'en-US': 'amount of message to clear'
})
    .setMaxValue(100)
    .setMinValue(1)
    .setRequired(true));
exports.default = {
    data: SlashCommand,
    execute(interaction, client) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = interaction.appPermissions) === null || _a === void 0 ? void 0 : _a.has('ManageMessages'))) {
                client.commandsMessage.embedPermissionDenied('ManageMessages', 'bot');
                client.commandsMessage.send(true, true);
                return;
            }
            if (!interaction.memberPermissions.has('ManageMessages')) {
                client.commandsMessage.embedPermissionDenied('ManageMessages', 'member');
                client.commandsMessage.send(true, true);
                return;
            }
            let amountOption = interaction.options.getNumber('amount', true);
            let channel = interaction.channel;
            client.commandsMessage.setMessageNumber = amountOption;
            if (!channel) {
                client.commandsMessage.embedNotFound('canal');
                client.commandsMessage.send(true, true);
                return;
            }
            channel.bulkDelete(amountOption)
                .then(() => {
                client.commandsMessage.embedAction(true, 'clear');
                client.commandsMessage.send(true, false);
            })
                .catch(() => {
                client.commandsMessage.embedAction(false, 'clear');
                client.commandsMessage.send(true, true);
            });
        });
    }
};
