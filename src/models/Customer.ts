import mongoose, { Schema, Model, Document, mongo } from "mongoose";
import { OrderDoc } from "./Order";

interface CustomerDoc extends Document {
    email: string;
    password: string;
    salt: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    verified: boolean;
    otp: number;
    otp_expiry: Date;
    lat: number;
    lng: number;
    cart: [any]
    orders: [OrderDoc]
}

const CustomerSchema = new Schema({

    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        required: true,
    },
    otp: {
        type: Number,
        required: true,
    },
    otp_expiry: {
        type: Date,
        required: true,
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    },
    cart: [
        {
            food: {
                type: mongoose.Schema.ObjectId,
                ref: 'food',
            },
            unit: {
                type: Number,
            }
        }
    ],
    orders: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'order'
        }
    ]
},
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.password
                delete ret.salt
                delete ret.__v
                delete ret.createdAt
                delete ret.updatedAt
            }
        },
        timestamps: true
    }
)

export const Customer = mongoose.model<CustomerDoc>('customer', CustomerSchema)

