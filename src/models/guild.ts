import mongoose from 'mongoose'

export interface guildType {
    guildId:string,
    welcomeChannelId?:string
}

export interface guildDocument extends guildType, mongoose.Document {

}

const guildSchema = new mongoose.Schema({
    guildId: {
        type:String,
        require:true
    },

    welcomeChannelId: {
        type:String,
        require:false
    }
})

export const guildModel = mongoose.model<guildDocument>('guilds', guildSchema)
