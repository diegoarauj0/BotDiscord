import Client from "../client"
import { ActivityOptions, ActivityType } from 'discord.js'

class Status {

    private client:Client
    private status:Array<{text:string, Activity:ActivityOptions}> = [
        { text:'o servidor', Activity:{type:ActivityType.Watching} },
        { text:'Programar esse bot ta dificil em...', Activity:{type:ActivityType.Watching} }
    ]

    constructor(client:Client) {
        this.client = client
    }

    get randomStatus(): {text:string, Activity:ActivityOptions} {

        if (this.status.length == 0) {
            return {text:'...', Activity:{type:ActivityType.Watching}}
        }
        let randomNumber = parseInt(String(Math.random() * this.status.length))
        let randomStatus = this.status[randomNumber]
        return randomStatus
    }

    public start(): void {
        this.client.user?.setActivity(this.randomStatus.text,this.randomStatus.Activity)
        setInterval(() => {
            this.client.user?.setActivity(this.randomStatus.text,this.randomStatus.Activity)
        },600000)
    }
}

export default Status