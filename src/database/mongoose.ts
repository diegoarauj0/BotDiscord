import mongoose from 'mongoose'
import { _URL } from '../config/mongodb.json'

function connect(): Promise<void> {
    return new Promise(async (resolve,reject) => {
        try {
            console.log('--database--')
            mongoose.set('strictQuery', true)
            await mongoose.connect(_URL)
            console.log('conectado ao banco de dados\n--database--')
            resolve()
        } catch(reason) {
            reject(reason)
        }
    })
}

export default connect