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
    'pt-BR': 'membros',
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
            client.botMessage.languages = interaction.locale;
            client.botMessage.user = interaction.user;
            if (!((_a = interaction.appPermissions) === null || _a === void 0 ? void 0 : _a.has('BanMembers'))) {
                client.replyCommand(client.botMessage.messageBotPermission('BanMembers'), interaction, true);
                return;
            }
            if (!interaction.member.permissions.has(discord_js_1.PermissionFlagsBits.BanMembers)) {
                client.replyCommand(client.botMessage.messageUserPermission('BanMembers'), interaction, true);
                return;
            }
            let memberOption = interaction.options.getUser('member', true);
            let reasonOption = interaction.options.getString('reason');
            let member = interaction.guild.members.cache.get(memberOption.id);
            if (!member) {
                client.replyCommand(client.botMessage.messageNotFound('member'), interaction, true);
                return;
            }
            if (!member.bannable) {
                client.replyCommand(client.botMessage.messageBannableOrkickable('bannable'), interaction, true);
                return;
            }
            client.botMessage.target = member.user;
            let hoursOption = interaction.options.getNumber('hours', false);
            let deleteMessageSeconds = 0;
            deleteMessageSeconds = !hoursOption ? undefined : hoursOption * 3600;
            let reason = `${interaction.user.username}#${interaction.user.discriminator} => ${member.user.username}#${member.user.discriminator}: ${reasonOption || 'not found'}`;
            member.ban({ reason: reason, deleteMessageSeconds: deleteMessageSeconds })
                .then(() => {
                client.replyCommand(client.botMessage.messageActionSuccess('ban'), interaction, true);
            })
                .catch(() => {
                client.replyCommand(client.botMessage.messageBotError(), interaction, true);
            });
        });
    }
};
