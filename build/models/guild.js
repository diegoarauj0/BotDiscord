"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guildModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const guildSchema = new mongoose_1.default.Schema({
    guildId: {
        type: String,
        require: true
    },
    welcomeChannelId: {
        type: String,
        require: false
    }
});
exports.guildModel = mongoose_1.default.model('guilds', guildSchema);
