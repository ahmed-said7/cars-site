import { Injectable } from "@nestjs/common";
import {Schema,Document, Query } from "mongoose";
import { mongodbId } from "src/chat/chat.service";
import { Models } from "src/enums/models";
import { BrandDoc } from "./car.brand.schema";

@Injectable()
export class CarModelSchema {
    schema=new Schema({
        name:{
            type:String,
            trim:true
        },
        brand:{
            ref:Models.Brand,
            type:Schema.Types.ObjectId
        }
    },{
        timestamps:true
    });
    constructor(){
        this.schema.index({ name:"text" });
        
    };
};

export interface ModelDoc extends Document {
    name: string;
    brand:mongodbId;
};