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
    .setName('help')
    .setNameLocalizations({
    'pt-BR': 'ajuda',
    'en-US': 'help'
})
    .setDescription('show command list')
    .setDescriptionLocalizations({
    'pt-BR': 'mostrar lista comandos',
    'en-US': 'show command list'
});
exports.default = {
    data: SlashCommand,
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            client.botMessage.languages = interaction.locale;
            client.botMessage.user = interaction.user;
            client.botMessage.messageHelp(client.botCommands);
            let embed = client.botMessage.messageHelp(client.botCommands);
            client.replyCommand(embed, interaction, false);
        });
    }
};
