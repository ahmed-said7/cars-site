import { Injectable } from "@nestjs/common";
import {Schema,Document } from "mongoose";
import { Models } from "src/enums/models";

@Injectable()
export class CarBrandSchema {
    schema=new Schema({
        name:{
            type:String,
            trim:true
        },
        image:String
    },{
        timestamps:true,
        toJSON:{virtuals:true},toObject:{virtuals:true}
    });
    constructor(){
        this.schema.index({ name:"text" });
        this.schema.post("init",function(){
            if(this.image){
                this.image=`${process.env.url}/brand/${this.image}`;
            }
        });
        this.schema.post("save",function(){
            if(this.image){
                this.image=`${process.env.url}/brand/${this.image}`;
            }
        });
        this.schema.virtual("models",{
            localField: "_id",
            foreignField:"brand",
            ref:Models.CarModel
        });
        
    };
};

export interface BrandDoc extends Document  {
    name: string;
    image:string;
};
