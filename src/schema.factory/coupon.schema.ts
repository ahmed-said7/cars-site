import mongoose from "mongoose";
export const name='coupon';
export class CouponSchema {
    schema = new mongoose.Schema({
        name: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        max: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        },
    },{ timestamps: true }
)}
export interface CouponDoc extends mongoose.Document {
    name: string,
    max: number,
    discount: number
};