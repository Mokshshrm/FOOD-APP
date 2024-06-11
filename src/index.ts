import express from 'express'
import App from './services/ExpressService'
import Dbconncection from './services/DatabaseService'
import { PORT } from './config'


export const startServer = async () => {
    const app = express()
    await App(app)
    await Dbconncection()
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`)
    })
}
if (require.main === module) {
    startServer()
}
else {   
    require.main = module;
}

