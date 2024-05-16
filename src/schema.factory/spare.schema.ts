import {Schema,Document, Model} from "mongoose";
import { mongodbId } from "src/chat/chat.service";
import { Models } from "src/enums/models";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SpareSchema {
    schema=new Schema({
        carmodel : {
            type:Schema.Types.ObjectId,
            ref:Models.CarModel
        },
        brand: {
                type:Schema.Types.ObjectId,
                ref:Models.Brand
        },
        user: {
            type:Schema.Types.ObjectId,
            ref:Models.User
        },
        status:String,
        name:String,
        from:Number,
        to:Number,
        price:Number,
        image:String
    },{
        timestamps:true
    });
    constructor( ){
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
    };
};

export interface SpareDoc extends Document {
    carmodel:mongodbId;
    brand:mongodbId;
    user:mongodbId;
    name:string;
    from:number;
    to:number;
    price:number;
    image:string;
    status:string;
};