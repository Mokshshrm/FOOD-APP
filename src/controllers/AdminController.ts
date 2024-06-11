import { Request, Response, NextFunction } from "express"
import { CreateVandorInput } from "../dto"
import { Vandor } from '../models/index'
import { GeneratePassword, GenerateSalt } from "../utility";

export const findVandor = async (id: string | undefined, email?: string) => {
    if (email) {
        return await Vandor.findOne({ email: email })
    } else {
        return await Vandor.findById(id)
    }
}


export const CreateVandor = async (req: Request, res: Response) => {

    try {
        const { name, address, email, foodType, ownerName, password, phone, pincode } = <CreateVandorInput>req.body;
        // here we have to check with some value that should not repeate in databae like phoneNumber or email FUNCTION [findVandor] but as we are using unique:true in schema so that works done automaticaaly by mongoDB

        const salt = await GenerateSalt();
        const dcryptPass = await GeneratePassword(password, salt);
        const CreateVandor = await Vandor.create({
            name: name,
            ownerName: ownerName,
            foodType: foodType,
            pincode: pincode,
            address: address,
            phone: phone,
            email: email,
            password: dcryptPass,
            salt: salt,
            rating: 0,
            serviceAvailable: false,
            converImages: [],
            foods: []
        })
        return res.json({ success: true, data: CreateVandor })
    }
    catch (err) {
        return res.send(err)
    }
}

export const GetVandors = async (req: Request, res: Response) => {
    try {
        const vandors = await Vandor.find();
        if (vandors !== null)
            return res.json(vandors)
        else
            return res.json({ 'message': 'vandors data are not available' })
    }
    catch (err) {
        return res.json(err)
    }
}
export const GetVandorById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const vandor = await findVandor(id)
        if (vandor !== null)
            return res.json(vandor)
        else
            return res.json({ 'message': 'Vandor is not found' })
    }
    catch (err) {
        return res.json(err)
    }
} 