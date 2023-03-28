"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
exports.default = (interaction, client) => {
    var _a;
    if (!interaction.isChatInputCommand())
        return;
    let command = client.botCommands.get(interaction.commandName || '');
    if (!command) {
        let embed = new discord_js_1.default.EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()
            .setColor('Red')
            .setTitle('Comando não encontrado')
            .setDescription(`${((_a = interaction.command) === null || _a === void 0 ? void 0 : _a.name) || ''} esse comando não existe 😢, (eu acho🤔)`);
        interaction.reply({ embeds: [embed] });
        return;
    }
    command.execute(interaction, client);
};
