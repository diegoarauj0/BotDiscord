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
    .setName('kick')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.KickMembers)
    .setNameLocalizations({
    'en-US': 'kick',
    'pt-BR': 'expulsar'
})
    .setDescription('kick member from server')
    .setDescriptionLocalizations({
    'pt-BR': 'expulsar o membro do servidor',
    'en-US': 'kick member from server'
})
    .addUserOption(Option => Option
    .setName('member')
    .setNameLocalizations({
    'pt-BR': 'membro',
    'en-US': 'member'
})
    .setDescription('member to be kicked')
    .setDescriptionLocalizations({
    'pt-BR': 'membro a ser expulso',
    'en-US': 'member to be kicked'
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
            if (!((_a = interaction.appPermissions) === null || _a === void 0 ? void 0 : _a.has('KickMembers'))) {
                client.commandsMessage.embedPermissionDenied('KickMembers', 'bot');
                client.commandsMessage.send(true, true);
                return;
            }
            if (!interaction.memberPermissions.has('KickMembers')) {
                client.commandsMessage.embedPermissionDenied('KickMembers', 'member');
                client.commandsMessage.send(true, true);
                return;
            }
            let userOption = interaction.options.getUser('member', true);
            let reasonOption = interaction.options.getString('reason');
            let member = interaction.guild.members.cache.get(userOption.id);
            if (!member) {
                client.commandsMessage.embedNotFound('membro');
                client.commandsMessage.send(true, true);
                return;
            }
            client.commandsMessage.setTargetUser = member.user;
            if (!member.kickable) {
                client.commandsMessage.embedUnable('kickable');
                client.commandsMessage.send(true, true);
                return;
            }
            let reason = `
        membro que expulsor: ${interaction.user.username}#${interaction.user.discriminator}👮‍♂️\n
        membro expulso: ${member.user.username}#${member.user.discriminator}➡️🚪\n
        motivo: ${reasonOption || 'não definido'}📝
        `;
            client.commandsMessage.setReason = reasonOption || undefined;
            member.kick(reason)
                .then(() => {
                client.commandsMessage.embedAction(true, 'kick');
                client.commandsMessage.send(true, false);
            })
                .catch(() => {
                client.commandsMessage.embedAction(false, 'kick');
                client.commandsMessage.send(true, true);
            });
        });
    }
};
