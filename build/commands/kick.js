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
    'pt-BR': 'membros',
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
            client.botMessage.languages = interaction.locale;
            client.botMessage.user = interaction.user;
            if (!((_a = interaction.appPermissions) === null || _a === void 0 ? void 0 : _a.has('KickMembers'))) {
                client.replyCommand(client.botMessage.messageBotPermission('KickMembers'), interaction, true);
                return;
            }
            if (!interaction.member.permissions.has(discord_js_1.PermissionFlagsBits.KickMembers)) {
                client.replyCommand(client.botMessage.messageUserPermission('KickMembers'), interaction, true);
                return;
            }
            let userOption = interaction.options.getUser('member', true);
            let reasonOption = interaction.options.getString('reason');
            let member = interaction.guild.members.cache.get(userOption.id);
            if (!member) {
                client.replyCommand(client.botMessage.messageNotFound('member'), interaction, true);
                return;
            }
            if (!member.kickable) {
                client.replyCommand(client.botMessage.messageBannableOrkickable('kickable'), interaction, true);
                return;
            }
            let reason = `${interaction.user.username}#${interaction.user.discriminator} => ${member.user.username}#${member.user.discriminator}: ${reasonOption || ''}`;
            member.kick(reason)
                .then((member) => {
                client.botMessage.target = member.user;
                client.replyCommand(client.botMessage.messageActionSuccess('kick'), interaction, true);
            })
                .catch(() => {
                client.replyCommand(client.botMessage.messageBotError(), interaction, true);
            });
        });
    }
};
