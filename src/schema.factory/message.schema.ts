import { Injectable } from "@nestjs/common";
import {Schema,Document, Query} from "mongoose";
import { Models } from "src/enums/models";
import { ChatDoc } from "./chat.schema";
import { UserDoc } from "./user.schema";
import { mongodbId } from "src/chat/chat.service";

@Injectable()
export class MessageSchema {
    schema=new Schema({
        content:{
            type:String,
            trim:true
        },
        image:String,
        chat : {
            type:Schema.Types.ObjectId,
            ref:Models.Chat
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
                this.image=`${process.env.url}/message/${this.image}`;
            };
        });
        this.schema.post("save",function(){
            if(this.image){
                this.image=`${process.env.url}/message/${this.image}`;
            };
        });
        this.schema.pre< Query< MessageDoc|MessageDoc[], MessageDoc > >(/^find/,function(){
            this.populate([{path:"chat"},{path:"user"}]);
        });
    };
};

export interface MessageDoc extends Document {
    content: string;
    image:string,
    chat : mongodbId;
    user: mongodbId; 
};