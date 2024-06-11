import mongoose, { Schema, Model, Document } from "mongoose";

interface VandorDoc extends Document {
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    salt: string;
    serviceAvailable: boolean;
    converImages: [string];
    rating: number;
    foods: any;
}

const VandorSchema = new Schema({
    name: {
        type: String,
        required: [true, "missing : name"],
        trim: true
    },
    ownerName: {
        type: String,
        required: [true, "missing : owenerName"],

    },
    foodType: {
        type: [String]
    },
    pincode: {
        type: String,
        required: [true, "missing : pincode"]
    },
    address: {
        type: String
    },
    phone: {
        type: String,
        required: [true, "missing : phoneNumber"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "missing : Email"],
    },
    password: {
        type: String,
        required: [true, "missing : password"]
    },
    salt: {
        type: String,
        required: [true]
    },
    serviceAvailable: {
        type: Boolean
    },
    converImages: {
        type: [String]
    },
    rating: {
        type: Number
    },
    foods: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'food'
        }
    ]
},
{
    toJSON:{
        transform(doc,ret){
            delete ret.password
            delete ret.salt
            delete ret.__v
            delete ret.createdAt 
            delete ret.updatedAt
        }
    },
    timestamps: true
})

export const Vandor = mongoose.model<VandorDoc>('vandor', VandorSchema)

