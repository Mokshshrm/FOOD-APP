export interface CreateVandorInput {
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}

/*
{
    "name": "Example Restaurant",
    "address": "123 Main St",
    "email": "example@example.com",
    "foodType": "Italian",
    "ownerName": "John Doe",
    "password": "examplePassword",
    "phone": "123-456-7890",
    "pincode": "12345"
}*/


export interface VandorLoginInput {
    email: string;
    password: string;
}

export interface VandorPayLoad{
    _id:string;
    email:string;
    name:string;
    foodTypes:[string];
}

export interface EditVandorInputs{
    name:string;
    address:string;
    phone:string;
    foodType:[string];
}