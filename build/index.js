"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("./client"));
const discord_json_1 = require("./config/discord.json");
const client = new client_1.default(discord_json_1._TOKEN, discord_json_1._ID);
client.start();
