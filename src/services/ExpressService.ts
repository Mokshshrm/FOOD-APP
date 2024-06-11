import express, { Application, Request, Response } from 'express'
import path from 'path'
import { AdminRoute, VandorRoute, ShppingRoute, CustomerRoute } from '../routes/index'

export const uploadDir = path.join(__dirname, '../images')



export default async (app: Application) => {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use('/images', express.static(uploadDir))
    app.use('/admin', AdminRoute)
    app.use('/vandor', VandorRoute)
    app.use('/customer', CustomerRoute)
    app.use(ShppingRoute)


    app.get('/', (req: Request, res: Response) => {
        res.send("Welcome to food-Court")
    })

    return app;
}
