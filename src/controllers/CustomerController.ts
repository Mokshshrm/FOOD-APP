import { Request, Response, NextFunction } from "express";
import { plainToClass, plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import {
    CreateCutomerInput, EditCustomerProfileInputs, OrderInput, UserLogInInput
} from "../dto";
import { Customer, Food } from "../models";
import { GenerateSalt, GeneratePassword, GenerateSignature, ValidatePassword } from '../utility'
import { GenerateOTP, OnRequestOTP } from "../utility";
import { Order } from "../models/Order";


export const CustomerSignUp = async (req: Request, res: Response) => {

    try {

        const CustomerInputs = plainToClass(CreateCutomerInput, req.body)
        const inputErrors = await validate(CustomerInputs)
        if (inputErrors.length > 0) {
            return res.status(400).send(inputErrors)
        }

        const { email, phone, password } = CustomerInputs;
        const isUserExit = await Customer.findOne({ email: email });
        if (isUserExit !== null) {
            return res.send({ 'message': 'An User Exit with the provided email ID' })
        }
        const salt = await GenerateSalt();
        const hashPassword = await GeneratePassword(password, salt);
        const { otp, otp_expiry } = GenerateOTP()

        const result = await Customer.create({
            email: email,
            salt: salt,
            password: hashPassword,
            phone: phone,
            firstName: '',
            lastName: '',
            address: '',
            verified: false,
            otp: otp,
            otp_expiry: otp_expiry,
            lat: 0,
            lng: 0,
            orders: []
        })
        if (result) {

            // Send the OTP to customer
            await OnRequestOTP(otp, result.phone);

            // Generate the Signature 
            const Signature = await GenerateSignature({
                _id: result.id,
                email: result.email,
                verified: result.verified
            })
            // Send the result to Client
            return res.json({ signature: Signature, verified: result.verified, email: result.email })
        }
        return res.json({ 'message': 'Error with SignUp' });
    }
    catch (e) {
        return res.json(e);
    }
}
export const CustomerLogIn = async (req: Request, res: Response) => {

    try {
        const UserLogInInstance = plainToClass(UserLogInInput, req.body);
        const UserLogInError = await validate(UserLogInInstance)

        if (UserLogInError.length > 0) {
            return res.send(UserLogInError)
        }

        const { email, password } = UserLogInInstance

        const result = await Customer.findOne({ email: email });
        if (result) {
            const validate = await ValidatePassword(password, result.password, result.salt);
            if (validate) {
                const signature = await GenerateSignature({
                    _id: result.id,
                    email: result.email,
                    verified: result.verified
                })
                return res.send({ signature: signature, email: result.email, verified: result.verified })
            } else {
                //pass word does match
            }
        }
        return res.send({ 'message': 'Error with Login' })
    }
    catch (e) {
        return res.send(e);
    }
}
export const CustomerVerify = async (req: Request, res: Response) => {
    try {
        const { otp } = req.body;
        const customer = req.user;
        if (customer) {
            const profile = await Customer.findById(customer._id);
            if (profile) {
                if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                    profile.verified = true
                    const UpdatedCustomerProfile = await profile.save()
                    const signature = await GenerateSignature({
                        _id: UpdatedCustomerProfile.id,
                        email: UpdatedCustomerProfile.email,
                        verified: UpdatedCustomerProfile.verified
                    })
                    return res.send({ signature: signature, email: UpdatedCustomerProfile.email, verified: UpdatedCustomerProfile.verified })
                }
            }
        }
        return res.send({ 'message': 'Error with OTP Validation' })
    }
    catch (e) {
        return res.send(e);
    }
}
export const RequestOTP = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (user) {
            const result = await Customer.findById(user._id);
            if (result) {
                const { otp, otp_expiry } = GenerateOTP();
                result.otp = otp;
                result.otp_expiry = otp_expiry;
                const updatedUser = await result.save();
                await OnRequestOTP(updatedUser.otp, updatedUser.phone);
                return res.send({ 'message': 'OTP is has been sent to the registered Number' })
            }
        }
        return res.send({ 'message': 'Error for requestin OTP' });

    } catch (e) {
        return res.send(e);
    }
}
export const GetCustomerProfile = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (user) {
            const result = await Customer.findById(user._id).select('-otp -otp_expiry');
            return res.send(result)
        }
        return res.send({ 'message': 'Error while fetchin Profile' })
    }
    catch (e) {
        return res.send(e);
    }
}
export const EditCutomerProfile = async (req: Request, res: Response) => {
    try {
        const EditcustomerProfile = plainToClass(EditCustomerProfileInputs, req.body)
        const EditCustomerProfileError = await validate(EditCutomerProfile)
        if (EditCustomerProfileError.length > 0) {
            return res.send(EditCustomerProfileError);
        }
        const user = req.user
        if (user) {
            const { address, firstName, lastName } = EditcustomerProfile;
            const result = await Customer.findById(user._id);
            if (result) {
                result.address = address;
                result.firstName = firstName;
                result.lastName = lastName;
                const updatedResult = await result.save();
                return res.send(updatedResult);
            }
        }
        return res.send({ 'message': 'Error with updating Profile' })

    }
    catch (e) {
        return res.send(e);
    }
}



export const CreateOrder = async (req: Request, res: Response) => {

    try {

        // Grab Current Login Customer
        const user = req.user

        if (user) {
            // create an OrderId

            const profile = await Customer.findById(user._id)

            const orderId = `${Math.floor(Math.random() * 89999) + 1000}`

            // Grab order items request [ { id:xx , unit:xx }]
            console.log(req.body)
            const cart = <[OrderInput]>req.body  //  [ { id:xx , unit:xx }]

            let cartItem = Array();

            let netAmount = 0.0;

            // Calculate Order Amount:-
            const foods = await Food.find().where('_id').in(cart.map(item => item._id))

            foods.map(food => {
                cart.map(({ _id, unit }) => {
                    if (_id === food.id) {
                        netAmount += (unit * food.price);
                        cartItem.push({ food, unit })
                    }
                })
            })
            // Create Order with Item Description 
            if (cartItem) {
                const result = await Order.create({
                    orderId: orderId,
                    items: cartItem,
                    totalAmount: netAmount,
                    orderDate: new Date(),
                    paidThrow: 'COD',
                    paymentResponse: '',
                    orderStatus: 'panding'
                })
                if(result){
                    profile.orders.push(result);
                    const updatedProfile = await profile.save();
                    return res.send(updatedProfile)
                }
            }
            // Finally update orders to user account
        }
        return res.send({'message':"Error while Order Process"})
    }
    catch (e) {
        return res.send(e);
    }

}
export const GetOrders = async (req: Request, res: Response) => {

}
export const GetOrdersById = async (req: Request, res: Response) => {

}
