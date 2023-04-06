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
    .setName('unban')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers)
    .setNameLocalizations({
    'pt-BR': 'desbanir',
    'en-US': 'unban'
})
    .setDescription('unban a user from the server')
    .setDescriptionLocalizations({
    'pt-BR': 'desbanir um usuário do servidor',
    'en-US': 'unban a user from the server'
})
    .addStringOption(Option => Option
    .setName('userid')
    .setNameLocalizations({
    'pt-BR': 'iduser',
    'en-US': 'userid'
})
    .setDescription('ID of the user your want to unban')
    .setDescriptionLocalizations({
    'pt-BR': 'ID do usuário que você deseja desbanir',
    'en-US': 'ID of the user your want to unban'
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
            if (!((_a = interaction.appPermissions) === null || _a === void 0 ? void 0 : _a.has('BanMembers'))) {
                client.commandsMessage.embedPermissionDenied('BanMembers', 'bot');
                client.commandsMessage.send(true, true);
                return;
            }
            if (!interaction.memberPermissions.has('BanMembers')) {
                client.commandsMessage.embedPermissionDenied('BanMembers', 'member');
                client.commandsMessage.send(true, true);
                return;
            }
            let userIdOption = interaction.options.getString('userid', true);
            let reasonOption = interaction.options.getString('reason');
            yield interaction.guild.bans.fetch()
                .then((bans) => __awaiter(this, void 0, void 0, function* () {
                let userBan = bans.get(userIdOption);
                if (!userBan) {
                    client.commandsMessage.embedNotFound('membro');
                    client.commandsMessage.send(true, true);
                    return;
                }
                let user = userBan.user;
                let reason = `
            membro que desbaniu: ${interaction.user.username}#${interaction.user.discriminator}👮‍♂️\n
            membro desbanido: ${user.username}#${user.discriminator}➡️🚪\n
            motivo: ${reasonOption || 'não definido'}📝
            `;
                client.commandsMessage.setTargetUser = userBan.user;
                interaction.guild.members.unban(user.id, reason)
                    .then(() => {
                    client.commandsMessage.embedAction(true, 'unban');
                    client.commandsMessage.send(true, false);
                })
                    .catch(() => {
                    client.commandsMessage.embedAction(false, 'unban');
                    client.commandsMessage.send(true, true);
                });
            }))
                .catch(() => {
                client.commandsMessage.embedBotError();
                client.commandsMessage.send(true, true);
            });
        });
    }
};
