"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guild_1 = require("../models/guild");
exports.default = (guild, client) => {
    guild_1.guildModel.findOneAndRemove({ guildId: guild.id }).catch(() => { return; });
};
