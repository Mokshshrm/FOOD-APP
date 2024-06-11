import bcrypt from 'bcrypt'
import jwt, { sign } from 'jsonwebtoken'
import { VandorPayLoad } from '../dto'
import { APP_SECERET } from '../config'
import { Request } from 'express'
import { AuthPayload } from '../dto/Auth.dto'

export const GenerateSalt = async () => {
    return await bcrypt.genSalt()
}

export const GeneratePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt)
}

export const ValidatePassword = async (enteredPassword: string, savePassword: string, salt: string) => {
    return await bcrypt.hash(enteredPassword, salt) === savePassword
}

// 
export const GenerateSignature = async (payload: AuthPayload) => {
    return jwt.sign(payload, APP_SECERET, { expiresIn: '1d' })
}

export const ValidateSignature = async (req: Request) => {
    const signature = req.get('Authorization')
    if (signature) {
        const Payload = await jwt.verify(signature.split(' ')[1], APP_SECERET) as AuthPayload
        req.user = Payload
        return true;
    }
    return false;
}