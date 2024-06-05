import {Schema,Document} from "mongoose";
import { Models } from "src/enums/models";

export class ContactSchema {
    schema=new Schema({
        phone:{
            type:String,
            trim:true
        },
        email:String,
        message:String
    },{
        timestamps:true
    });
};

export interface ContactDoc extends Document {
    phone: string;
    email:string;
    message:string;
};