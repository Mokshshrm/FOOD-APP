import { AccountSID, authToken } from '../config';


// Email


// Notification



// OTP 
const GenerateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000)
    let otp_expiry = new Date();
    otp_expiry.setTime(new Date().getTime() + (30 * 60 * 110));
    return { otp, otp_expiry };
}

const OnRequestOTP = async (otp: number, toPhoneNumber: string) => {
    const accSID = AccountSID
    const authTKN = authToken
    const client = require('twilio')(accSID, authTKN)
    const respons = await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: '',
        to: `+91${toPhoneNumber}`,
    })
    return respons;
}

// Payment Notification or emails



export { GenerateOTP, OnRequestOTP }