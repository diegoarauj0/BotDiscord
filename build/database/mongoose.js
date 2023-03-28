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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_json_1 = require("../config/mongodb.json");
function connect() {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('--database--');
            mongoose_1.default.set('strictQuery', true);
            yield mongoose_1.default.connect(mongodb_json_1._URL);
            console.log('conectado ao banco de dados\n--database--');
            resolve();
        }
        catch (reason) {
            reject(reason);
        }
    }));
}
exports.default = connect;
