import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {Schema,Document,model, Model, Query} from "mongoose";
import { mongodbId } from "src/chat/chat.service";
import { Models } from "src/enums/models";
import { UserDoc } from "./user.schema";


@Injectable()
export class ChatSchema {
    schema=new Schema({
        name:{
            type:String,
            required:true,
            trim:true
        },
        image:String,
        admin : {
            type:Schema.Types.ObjectId,
            ref:Models.User
        },
        lastMessage : {
            type:Schema.Types.ObjectId,
            ref:Models.Message
        },
        user: {
                type:Schema.Types.ObjectId,
                ref:Models.User
        }
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

export interface ChatDoc extends Document {
    name: string;
    image:string;
    admin : mongodbId;
    user: mongodbId;
    lastMessage: mongodbId;
};