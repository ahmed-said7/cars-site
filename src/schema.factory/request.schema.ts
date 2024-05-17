import { Injectable } from "@nestjs/common";
import { Schema , Document } from "mongoose";
import { mongodbId } from "src/chat/chat.service";
import { Models } from "src/enums/models";

@Injectable()
export class RequestSchema {
    schema=new Schema({
        carmodel : {
            type:Schema.Types.ObjectId,
            ref:Models.CarModel
        },
        brand : {
                type:Schema.Types.ObjectId,
                ref:Models.Brand
        },
        year:Number,
        image:String,
        details:String,
        status: { type:String , enum:["new","used","both"] },
        name:String,
        user : {
            type:Schema.Types.ObjectId,
            ref:Models.User
        },
        paidOffer: {
            type:Schema.Types.ObjectId,
            ref:Models.Offer
        },
        completed:{ type:Boolean , default:false }
    },{
        timestamps:true
    });
    constructor(){
        this.schema.post("init",function(){
            if(this.image){
                this.image=`${process.env.url}/request/${this.image}`;
            }
        });
        this.schema.post("save",function(){
            if(this.image){
                this.image=`${process.env.url}/request/${this.image}`;
            }
        });
    };
};

export interface RequestDoc extends Document {
    carmodel : mongodbId;
    brand: mongodbId;
    user: mongodbId;
    paidOffer:mongodbId;
    year:number;
    image:string;
    status:string;
    details:string;
    completed:boolean;
    name:string;
    createdAt:Date;
    updatedAt:Date;
};