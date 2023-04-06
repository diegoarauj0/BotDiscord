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
    .setName('ban')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers)
    .setNameLocalizations({
    'pt-BR': 'banir',
    'en-US': 'ban'
})
    .setDescription('ban a user from the server')
    .setDescriptionLocalizations({
    'pt-BR': 'banir um usuário do servidor',
    'en-US': 'ban a user from the server'
})
    .addUserOption(Option => Option
    .setName('member')
    .setNameLocalizations({
    'pt-BR': 'membro',
    'en-US': 'member'
})
    .setDescription('member to be banned')
    .setDescriptionLocalizations({
    'pt-BR': 'membro a ser banido',
    'en-US': 'member to be banned'
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
    .setRequired(false))
    .addNumberOption(Option => Option
    .setName('hours')
    .setNameLocalizations({
    'pt-BR': 'horas',
    'en-US': 'hours'
})
    .setDescription('delete message history in hours')
    .setDescriptionLocalizations({
    'pt-BR': 'excluir histórico de mensagens em horas',
    'en-US': 'delete message history in hours'
})
    .setMaxValue(168)
    .setMinValue(1)
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
            let memberOption = interaction.options.getUser('member', true);
            let reasonOption = interaction.options.getString('reason');
            let member = interaction.guild.members.cache.get(memberOption.id);
            if (!member) {
                client.commandsMessage.embedNotFound('membro');
                client.commandsMessage.send(true, true);
                return;
            }
            client.commandsMessage.setTargetUser = member.user;
            if (!member.bannable) {
                client.commandsMessage.embedUnable('bannable');
                client.commandsMessage.send(true, true);
                return;
            }
            let hoursOption = interaction.options.getNumber('hours', false);
            let deleteMessageSeconds = !hoursOption ? undefined : hoursOption * 3600;
            let reason = `
        membro que baniu: ${interaction.user.username}#${interaction.user.discriminator}👮‍♂️\n
        membro banido: ${member.user.username}#${member.user.discriminator}➡️🚪\n
        motivo: ${reasonOption || 'não definido'}📝
        `;
            client.commandsMessage.setReason = reasonOption || undefined;
            member.ban({ reason: reason, deleteMessageSeconds: deleteMessageSeconds })
                .then(() => {
                client.commandsMessage.embedAction(true, 'ban');
                client.commandsMessage.send(true, false);
            })
                .catch(() => {
                client.commandsMessage.embedAction(false, 'ban');
                client.commandsMessage.send(true, true);
            });
        });
    }
};
