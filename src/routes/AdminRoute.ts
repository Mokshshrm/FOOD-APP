import express, { Request, Response, NextFunction } from 'express'
import { CreateVandor, GetVandorById, GetVandors } from '../controllers/index'


const Router = express.Router()



Router.get('/', (req: Request, res: Response) => {
    res.json({ 'message': "Admin" })
})


Router.post('/vandor', CreateVandor)
Router.get('/vandors', GetVandors)
Router.get('/vandor/:id', GetVandorById)



export { Router as AdminRoute }