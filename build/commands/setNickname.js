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
    .setName('change_nickname')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageNicknames)
    .setNameLocalizations({
    "en-US": 'change_nickname',
    'pt-BR': 'alterar_apelido'
})
    .setDescription('change nickname')
    .setDescriptionLocalizations({
    'pt-BR': 'alterar apelido',
    'en-US': 'change nickname'
})
    .addStringOption(Option => Option
    .setName('nickname')
    .setNameLocalizations({
    'en-US': 'nickname',
    'pt-BR': 'apelido'
})
    .setDescription('new nickname')
    .setDescriptionLocalizations({
    'en-US': 'new nickname',
    'pt-BR': 'novo apelido'
})
    .setMaxLength(32)
    .setRequired(true))
    .addUserOption(Option => Option
    .setName('member')
    .setNameLocalizations({
    'pt-BR': 'membro',
    'en-US': 'member'
})
    .setDescription('member')
    .setDescriptionLocalizations({
    'pt-BR': 'membro',
    'en-US': 'member'
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
            if (!((_a = interaction.appPermissions) === null || _a === void 0 ? void 0 : _a.has('ManageNicknames'))) {
                client.commandsMessage.embedPermissionDenied('ManageNicknames', 'bot');
                client.commandsMessage.send(true, true);
                return;
            }
            if (!interaction.memberPermissions.has('ManageNicknames')) {
                client.commandsMessage.embedPermissionDenied('ManageNicknames', 'member');
                client.commandsMessage.send(true, true);
                return;
            }
            let nicknameOption = interaction.options.getString('nickname', true);
            let memberOption = interaction.options.getUser('member', true);
            let member = interaction.guild.members.cache.get(memberOption.id);
            let reasonOption = interaction.options.getString('reason', false);
            if (!member) {
                client.commandsMessage.embedNotFound('membro');
                client.commandsMessage.send(true, true);
                return;
            }
            let reason = `
        quem altero o apelido: ${interaction.user.username}#${interaction.user.discriminator}👮‍♂️\n
        nome antigo: ${member.user.username}➡️🚪\n
        nome novo: ${nicknameOption}📝\n
        motivo: ${reasonOption || 'não definido'}📝
        `;
            client.commandsMessage.setReason = reasonOption || undefined;
            client.commandsMessage.setNewName = nicknameOption;
            client.commandsMessage.setOldName = member.nickname || undefined;
            client.commandsMessage.setTargetUser = member.user;
            member.setNickname(nicknameOption, reason)
                .then(() => {
                client.commandsMessage.embedAction(true, 'setNickname');
                client.commandsMessage.send(true, false);
            })
                .catch(() => {
                client.commandsMessage.embedAction(false, 'setNickname');
                client.commandsMessage.send(true, true);
            });
        });
    }
};
