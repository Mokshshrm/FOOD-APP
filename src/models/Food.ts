import mongoose, { Document, model, Schema } from "mongoose";

export interface Fooddoc extends Document {
    vandorId: string;
    name: string;
    description: string;
    category: string;
    foodType: string;
    readyTime: string;
    price: number;
    rating: number;
    images: [string];
}

const FoodSchema = new Schema({
    vandorId: {
        type: String,
    },
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    category: {
        type: String,
    },
    foodType: {
        type: String,
        require: true
    },
    readyTime: {
        type: String,
    },
    price: {
        type: Number,
        require: true
    },
    rating: {
        type: Number,
    },
    images: {
        type: [String],
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


export const Food = mongoose.model<Fooddoc>('food', FoodSchema)