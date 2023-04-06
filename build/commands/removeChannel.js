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
    .setName('del_channel')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageChannels)
    .setNameLocalizations({
    "en-US": 'del_channel',
    'pt-BR': 'del_canal'
})
    .setDescription('remove channel')
    .setDescriptionLocalizations({
    'pt-BR': 'remover o canal',
    'en-US': 'remove channel'
})
    .addChannelOption(Option => Option
    .setName('channel')
    .setNameLocalizations({
    'pt-BR': 'canal',
    'en-US': 'channel'
})
    .setDescription('the channel to be removed')
    .setDescriptionLocalizations({
    'pt-BR': 'o canal que vai ser removido',
    'en-US': 'the channel to be removed'
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
            let channelOption = interaction.options.getChannel('channel', true);
            let reasonOption = interaction.options.getString('reason', false);
            let channel = interaction.guild.channels.cache.get(channelOption.id);
            if (!channel) {
                client.commandsMessage.embedNotFound('canal');
                client.commandsMessage.send(true, true);
                return;
            }
            let reason = `
        membro que removeu o canal: ${interaction.user.username}#${interaction.user.discriminator}👮‍♂️\n
        canal removido: ${channel.name}🗑️\n
        motivo: ${reasonOption || 'não definido'}📝
        `;
            client.commandsMessage.setOldName = channel.name;
            client.commandsMessage.setReason = reasonOption || undefined;
            channel.delete(reason)
                .then(() => {
                client.commandsMessage.embedAction(true, 'removeChannel');
                client.commandsMessage.send(true, false);
            })
                .catch(() => {
                client.commandsMessage.embedAction(false, 'removeChannel');
                client.commandsMessage.send(true, true);
            });
        });
    }
};
