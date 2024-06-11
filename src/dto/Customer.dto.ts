import { IsEmail, Length } from 'class-validator'



class CreateCutomerInput {

    @IsEmail()
    email: string;

    @Length(6, 12)
    password: string;

    @Length(7, 12)
    phone: string;

}

class UserLogInInput {

    @IsEmail()
    email: string;

    @Length(6, 12)
    password: string;
}

class EditCustomerProfileInputs {
    @Length(3, 16)
    firstName: string;

    @Length(3, 16)
    lastName: string;

    @Length(6, 16)
    address: string;

}

interface CustomerPayLoad {
    _id: string;
    email: string;
    verified: boolean;
}

class OrderInput {
    _id: string;
    unit: number;
}


export { CreateCutomerInput, CustomerPayLoad, UserLogInInput, EditCustomerProfileInputs, OrderInput }