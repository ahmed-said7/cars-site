import { Injectable } from "@nestjs/common";
import {Schema,Document} from "mongoose";
import { mongodbId } from "src/chat/chat.service";
import { Models } from "src/enums/models";


@Injectable()
export class OwnCarsSchema {
    schema=new Schema({
        year:Number,
        image:String,
        user : {
            type:Schema.Types.ObjectId,
            ref:Models.User
        },
        brand: {
            type:Schema.Types.ObjectId,
            ref:Models.Brand
        },
        carmodel: {
            type:Schema.Types.ObjectId,
            ref:Models.CarModel
        },
    },{
        timestamps:true
    });
    constructor(){
        this.schema.post("init",function(){
            if(this.image){
                this.image=`${process.env.url}/chat/${this.image}`;
            }
        });
        this.schema.post("save",function(){
            if(this.image){
                this.image=`${process.env.url}/chat/${this.image}`;
            }
        });
    };
};

export interface OwnCarsDoc extends Document {
    year: number;
    image:string;
    carmodel:mongodbId;
    user: mongodbId;
    brand: mongodbId;
};