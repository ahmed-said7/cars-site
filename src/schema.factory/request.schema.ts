import { Injectable } from "@nestjs/common";
import { Schema , Document } from "mongoose";
import { mongodbId } from "src/chat/chat.service";
import { Models } from "src/enums/models";
import { requestType } from "src/requests/dto/create.request.dto";

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
        status: { 
            type:String , enum:[requestType.new,requestType.used,requestType.both] ,
            default : requestType.both
        },
        name:String,
        user : {
            type:Schema.Types.ObjectId,
            ref:Models.User
        },
        priceReq:{ type:Number , default:0 },
        quantity:{ type:Number , default:1 },
        completed:{ type:Boolean , default:false }
    },{
        timestamps:true,
        toJSON:{virtuals:true},toObject:{virtuals:true}
    });
    constructor(){
        this.schema.post("init",function(){
            if(this.image){
                this.image=`${process.env.url}/spare/${this.image}`;
            }
        });
        this.schema.post("save",function(){
            if(this.image){
                this.image=`${process.env.url}/spare/${this.image}`;
            }
        });
        this.schema.virtual("offers",{
            localField:"_id",
            foreignField:"request",
            ref:Models.Offer
        })
    };
};

export interface RequestDoc extends Document {
    carmodel : mongodbId;
    brand: mongodbId;
    user: mongodbId;
    year:number;
    image:string;
    status:string;
    details:string;
    completed:boolean;
    name:string;
    createdAt:Date;
    updatedAt:Date;
    priceReq:number;
    quantity:number;
};