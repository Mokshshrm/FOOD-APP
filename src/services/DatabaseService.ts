import mongoose, { ConnectOptions } from 'mongoose'
import { CONNECTION_STR } from '../config'


export default async () => {
    try {
        await mongoose.connect(CONNECTION_STR, {
            useNewUrlParser: true
        } as ConnectOptions)
        console.log('Db is connected')
    }
    catch (e) {
        console.log(e)
    }
    return
}
