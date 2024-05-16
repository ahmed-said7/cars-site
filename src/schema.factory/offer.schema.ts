import { Injectable } from "@nestjs/common";
import { Schema , Document } from "mongoose";
import { mongodbId } from "src/chat/chat.service";
import { Models } from "src/enums/models";

@Injectable()
export class OfferSchema {
    schema=new Schema({
        request : {
            type:Schema.Types.ObjectId,
            ref:Models.Request
        },
        price:Number,
        image:String,
        status: { type:String , enum:["new","used"] },
        trader : {
            type:Schema.Types.ObjectId,
            ref:Models.User
        },
        userAccepted : { type:Boolean , default:false } ,
        userRejected : { type:Boolean , default:false } ,
        traderAccepted : { type:Boolean , default:false }
    },{
        timestamps:true
    });
    constructor(){
        this.schema.post("init",function(){
            if(this.image){
                this.image=`${process.env.url}/offer/${this.image}`;
            }
        });
        this.schema.post("save",function(){
            if(this.image){
                this.image=`${process.env.url}/offer/${this.image}`;
            }
        });
    };
};

export interface OfferDoc extends Document {
    request : mongodbId;
    price:number;
    image:string;
    status:string;
    trader:mongodbId;
    userAccepted:boolean;
    traderAccepted:boolean;
    userRejected:boolean;
};