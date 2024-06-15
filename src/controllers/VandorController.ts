import { Request, Response, NextFunction } from "express";
import { EditVandorInputs, VandorLoginInput } from "../dto";
import { findVandor } from "./AdminController";
import { GenerateSignature, ValidatePassword } from "../utility";
import { CreateFoodInput } from "../dto/Food.dto";
import { Food } from "../models/index"

export const vandorLogin = async (req: Request, res: Response) => {

    const { email, password } = <VandorLoginInput>req.body
    const exisitingVandor = await findVandor('', email)

    if (exisitingVandor !== null) {

        const validation = await ValidatePassword(password, exisitingVandor.password, exisitingVandor.salt)
        if (validation) {
            const singnature = await GenerateSignature({
                _id: exisitingVandor.id,
                email: exisitingVandor.email,
                name: exisitingVandor.name,
                foodTypes: exisitingVandor.foodType
            })
            return res.send(singnature)
        }
        else {
            return res.send({ 'message': 'password in invalid' })
        }

    }
    else
        return res.send({ 'message': 'Login credentials are not valid' })

}

export const GetVandorProfile = async (req: Request, res: Response) => {

    const user = req.user
    if (user) {
        const exisitingVandor = await findVandor(user._id)
        return res.send(exisitingVandor)
    }
    else
        return res.send({ 'message': 'user profile not found' })

}

export const UpdateVandorProfile = async (req: Request, res: Response) => {

    const { name, address, phone, foodType } = <EditVandorInputs>req.body
    const user = req.user
    if (user) {
        const exisitingVandor = await findVandor(user._id)
        if (exisitingVandor !== null) {
            exisitingVandor.name = name
            exisitingVandor.address = address
            exisitingVandor.phone = phone
            exisitingVandor.foodType = foodType
            const savedResult = await exisitingVandor.save()
            return res.send(savedResult)
        }
        return res.send(exisitingVandor)
    }
    return res.send({ 'message': 'user profile not found' })

}

export const UpdateVandorCoverImage = async (req: Request, res: Response) => {

    const user = req.user
    if (user) {
        const vandor = await findVandor(user._id);
        if (vandor !== null) {
            const file = req.files as [Express.Multer.File]
            const images = file.map((file: Express.Multer.File) => file.filename)
            vandor.converImages.push(...images);
            const result = await vandor.save();
            return res.json(result)
        }
        else
            return res.send(vandor)
    }
    else
        return res.send({ 'message': "User not Authorized" })

}

export const UpdateVandorService = async (req: Request, res: Response) => {

    const user = req.user;
    console.log(user)
    if (user) {
        const exisitingVandor = await findVandor(user._id);
        if (exisitingVandor !== null) {
            exisitingVandor.serviceAvailable = !exisitingVandor.serviceAvailable
            const savedResult = await exisitingVandor.save()
            return res.send(savedResult)
        }
        else
            return res.send(exisitingVandor)
    }
    else
        return res.send({ 'message': 'User not Authorized. ' })

}

export const AddFood = async (req: Request, res: Response) => {

    const user = req.user
    if (user) {
        const { category, description, foodType, name, price, readyTime } = <CreateFoodInput>req.body;
        const vandor = await findVandor(user._id);
        if (vandor !== null) {

            const files = req.files as [Express.Multer.File]
            const images = files.map((file: Express.Multer.File) => file.filename)


            const addedFood = await Food.create({
                vandorId: user._id,
                name: name,
                description: description,
                category: category,
                foodType: foodType,
                readyTime: readyTime,
                price: price,
                rating: 0,
                images: images
            })
            vandor.foods.push(addedFood)
            const result = await vandor.save();
            return res.json(result)
        }
        else
            return res.send(vandor)
    }
    else
        return res.send({ 'message': "User not Authorized" })

}

export const GetFoods = async (req: Request, res: Response) => {

    const user = req.user
    if (user) {
        const food = await Food.find({ vandorId: user._id })
        return res.send(food)
    }
    else
        return res.send({ 'message': 'User not Authorized. ' })

}
