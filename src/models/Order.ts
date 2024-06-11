import mongoose, { Document, model, Schema } from "mongoose";

export interface OrderDoc extends Document {
    orderId: string; // 55353
    items: [any];      // [{food,unit}]
    totalAmount: number; // 4352
    orderDate: Date;
    paidThrow: string; // cod , credit card , wallet
    paymentResponse: string; // {status:true,response:some bank response}
    orderStatus: string;
}


const OrderSchema = new Schema({
    orderId: {
        type: String,
        required: true
    },
    items: [
        {
            food: {
                type: mongoose.Schema.ObjectId,
                ref: 'food', required: true
            },
            unit: {
                type: Number,
                required: true
            }
        }
    ]
    ,
    totalAmount: {
        type: Number,
        required: true
    },
    orderDate: {
        type: String
    },
    paidThrow: {
        type: String
    },
    paymentResponse: {
        type: String
    },
    orderStatus: {
        type: String
    }
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v
            delete ret.createdAt
            delete ret.updatedAt
        }
    },
    timestamps: true,
})


export const Order = mongoose.model<OrderDoc>('order', OrderSchema)