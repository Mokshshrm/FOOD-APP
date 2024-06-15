import express, { Request, Response, NextFunction } from 'express'
import path from 'path'
import { AddFood, CreateVandor, GetCurrentOrders, GetFoods, GetOrderDetails, GetVandorProfile, ProcessOrder, UpdateVandorCoverImage, UpdateVandorProfile, UpdateVandorService, vandorLogin } from '../controllers'
import { Authenticate } from '../middlewares'
import multer from 'multer'
import { uploadDir } from '../services/ExpressService'

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); `  `
    }
})

const images = multer({
    storage: imageStorage
}).array('images', 10)

const Router = express.Router()

Router.post('/login', vandorLogin)

Router.use(Authenticate)
Router.get('/profile', GetVandorProfile)
Router.patch('/profile', UpdateVandorProfile)
Router.patch('/service', UpdateVandorService)
Router.patch('/coverimage', images, UpdateVandorCoverImage)


Router.post('/food', images, AddFood)
Router.get('/foods', GetFoods)

Router.get('/orders', GetCurrentOrders);
Router.put('/order/:id/process', ProcessOrder);
Router.get('/order/:id', GetOrderDetails);





export { Router as VandorRoute }