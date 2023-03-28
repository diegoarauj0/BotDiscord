"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guild_1 = require("../models/guild");
exports.default = (guild, client) => {
    guild_1.guildModel.findOne({ guildId: guild.id })
        .then((Guild) => {
        if (!Guild) {
            guild_1.guildModel.create({
                guildId: guild.id
            }).catch(() => { return; });
        }
    })
        .catch(() => {
        guild_1.guildModel.create({
            guildId: guild.id
        }).catch(() => { return; });
    });
};
