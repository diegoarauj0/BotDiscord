"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("./database/mongoose"));
const message_1 = __importDefault(require("./class/message"));
class Client extends discord_js_1.default.Client {
    constructor(token, id) {
        super({ intents: ['GuildModeration', 'Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent', 'GuildMessageTyping', 'DirectMessages', 'GuildBans'] });
        this.botCommands = new discord_js_1.default.Collection();
        this.botStatus = new discord_js_1.default.Collection;
        this.botMessage = new message_1.default();
        this.botId = id;
        this.botToken = token;
        this.REST = new discord_js_1.default.REST({ version: '10' }).setToken(this.botToken);
        this.replyCommand = (embed, interaction, deleteMessage) => {
            interaction.reply({ embeds: [embed], ephemeral: true })
                .then((message) => { if (!deleteMessage) {
                return;
            } ; setTimeout(() => { message.delete(); }, 10000); })
                .catch(() => { return; });
        };
    }
    start() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, mongoose_1.default)();
                yield this.loadCommands();
                yield this.loadEvents();
                yield this.startBot();
                this.loadStatus();
                resolve();
            }
            catch (reason) {
                reject(reason);
            }
        }));
    }
    loadCommands() {
        return new Promise((resolve, reject) => {
            console.log('--Comandos--');
            promises_1.default.readdir(path_1.default.join(`${__dirname}/commands`))
                .then((commandsFile) => __awaiter(this, void 0, void 0, function* () {
                let body = [];
                for (let c in commandsFile) {
                    try {
                        const slashCommand = yield Import(`./commands/${commandsFile[c]}`);
                        this.botCommands.set(slashCommand.data.name, slashCommand);
                        body.push(slashCommand.data.toJSON());
                        console.log(`${commandsFile[c]}: ok`);
                    }
                    catch (reason) {
                        console.log(`${commandsFile} error:${reason}`);
                    }
                }
                yield this.REST.put(discord_js_1.default.Routes.applicationCommands(this.botId), { body: body }).catch((reason) => { reject(reason); });
                console.log('--Comandos--');
                resolve();
            }))
                .catch((reason) => {
                reject(reason);
            });
        });
        function Import(url) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const importedFile = yield Promise.resolve(`${url}`).then(s => __importStar(require(s)));
                    resolve(importedFile.default);
                }
                catch (reason) {
                    reject(reason);
                }
            }));
        }
    }
    loadEvents() {
        return new Promise((resolve, reject) => {
            console.log('--Eventos--');
            promises_1.default.readdir(path_1.default.join(`${__dirname}/events`))
                .then((eventsFile) => __awaiter(this, void 0, void 0, function* () {
                for (let e in eventsFile) {
                    try {
                        const eventFunc = yield Import(`./events/${eventsFile[e]}`);
                        this.on(path_1.default.parse(eventsFile[e]).name, (eventParameter) => {
                            eventFunc(eventParameter, this);
                        });
                        console.log(`${eventsFile[e]}: ok`);
                    }
                    catch (reason) {
                        console.log(`${eventsFile} error:${reason}`);
                    }
                }
                resolve();
                console.log('--Eventos--');
            }))
                .catch((reason) => {
                reject(reason);
            });
        });
        function Import(url) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const importedFile = yield Promise.resolve(`${url}`).then(s => __importStar(require(s)));
                    resolve(importedFile.default);
                }
                catch (reason) {
                    reject(reason);
                }
            }));
        }
    }
    loadStatus() {
        var _a, _b;
        this.botStatus.set('1', { text: 'o servidor', Activity: { type: discord_js_1.default.ActivityType.Watching } });
        console.log('--Status--');
        this.botStatus.forEach((value) => {
            console.log(`o status "${value.text}" foi adicionado ao bot`);
        });
        console.log('--Status--');
        let statusRandom = this.botStatus.random();
        if (statusRandom) {
            (_a = this.user) === null || _a === void 0 ? void 0 : _a.setActivity(statusRandom === null || statusRandom === void 0 ? void 0 : statusRandom.text, statusRandom === null || statusRandom === void 0 ? void 0 : statusRandom.Activity);
            console.log(`O status "${statusRandom.text}" do tipo "${((_b = statusRandom.Activity.type) === null || _b === void 0 ? void 0 : _b.toString()) || ''}" esta ativado nesse momento`);
        }
        setInterval(() => {
            var _a, _b;
            statusRandom = this.botStatus.random();
            if (statusRandom) {
                (_a = this.user) === null || _a === void 0 ? void 0 : _a.setActivity(statusRandom === null || statusRandom === void 0 ? void 0 : statusRandom.text, statusRandom === null || statusRandom === void 0 ? void 0 : statusRandom.Activity);
                console.log(`O status "${statusRandom.text}" do tipo "${((_b = statusRandom.Activity.type) === null || _b === void 0 ? void 0 : _b.toString()) || ''}" esta ativado nesse momento`);
            }
        }, 600000);
    }
    startBot() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield this.login(this.botToken).catch((reason) => { reject(reason); });
            resolve();
        }));
    }
}
exports.default = Client;
