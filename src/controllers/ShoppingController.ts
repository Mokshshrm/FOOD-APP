import { Request, Response, NextFunction } from 'express'
import { Fooddoc, Vandor } from '../models';
import { vandorLogin } from './VandorController';




export const GetFoodAvaibility = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pincode = req.params.pincode;
        const result = await Vandor.find({ pincode: pincode, serviceAvailable: true })
            .sort([['rating', 'descending']])
            .populate("foods")
        if (result.length > 0) {
            return res.status(200).send(result);
        }
        else {
            return res.send({ 'message': 'Data Not Found' })
        }
    }
    catch (e) {
        return res.json(e)
    }
}

export const GetTopRestaurants = async (req: Request, res: Response) => {
    try {
        const pincode = req.params.pincode;
        const result = await Vandor.find({ pincode: pincode, serviceAvailable: true })
            .sort([['rating', 'ascending']])
            .limit(5)


        if (result.length > 0) {
            return res.status(200).send(result);
        }
        else {
            return res.send({ 'message': 'Data Not Found' })
        }
    }
    catch (e) {
        return res.json(e)
    }
}

export const GetFoodsIn30Min = async (req: Request, res: Response) => {
    try {
        const pincode = req.params.pincode;
        const result = await Vandor.find({ pincode: pincode, serviceAvailable: true })
            .populate('foods')


        if (result.length > 0) {
            let food30MinAvailable: any = [];
            result.forEach(vandor => {
                food30MinAvailable.push(...((vandor.foods as [Fooddoc]).filter(food => +food.readyTime <= 30)))
            })
            return res.status(200).send(food30MinAvailable)
        }
        else {
            return res.send({ 'message': 'Data Not Found' })
        }
    }
    catch (e) {
        return res.json(e)
    }
}

export const SearchFoods = async (req: Request, res: Response) => {
    try {
        const pincode = req.params.pincode;
        const result = await Vandor.find({ pincode: pincode, serviceAvailable: true })
            .populate('foods')
        if (result.length > 0) {
            let foods: any = [];
            foods = result.map(vandor => vandor.foods)
            return res.status(200).send(foods)
        }
        else {
            return res.send({ 'message': 'Data Not Found' })
        }
    }
    catch (e) {
        return res.json(e)
    }
}

export const RestaurantsById = async (req: Request, res: Response) => {
    try {
        const result = await Vandor.findById(req.params.id).populate('foods')
        if (result)
            return res.send(result)
        else
            return res.send({ 'message': 'Data Not Found' })
    }
    catch (e) {
        return res.send(e)
    }
}
