import { Injectable } from "@nestjs/common";
import { Schema , Document } from "mongoose";
import { mongodbId } from "src/chat/chat.service";
import { Models } from "src/enums/models";

@Injectable()
export class OrderSchema {
    schema=new Schema({
        offer : {
            type:Schema.Types.ObjectId,
            ref:Models.Offer
        },
        request : {
                type:Schema.Types.ObjectId,
                ref:Models.Request
        },
        user : {
            type:Schema.Types.ObjectId,
            ref:Models.User
        },
        trader: {
            type:Schema.Types.ObjectId,
            ref:Models.User
        },
        tranRef:String,
        price:Number,
        delivered:{ type:Boolean , default:false },
        deliveredAt:Date,
        address:{
            postalCode:Number,
            details:String,
            city:String,
            street:String,
            mobile:String
        }
    },{
        timestamps:true
    });
    constructor(){
    };
};

export interface OrderDoc extends Document {
    offer:mongodbId;
    request:mongodbId;
    user:mongodbId;
    trader:mongodbId;
    price:number;
    delivered:boolean;
    deliveredAt:Date;
    tranRef:string;
    address:{
        postalCode:number,
        details:string,
        city:string,
        street:string,
        mobile:string
    }
};