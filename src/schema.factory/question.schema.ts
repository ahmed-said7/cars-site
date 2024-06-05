import {Schema,Document} from "mongoose";


export class QuestionSchema {
    schema=new Schema({
        question:{
            type:String,
            trim:true
        },
        answer:String
    },{
        timestamps:true
    });
};

export interface QuestionDoc extends Document {
    question: string;
    answer:string;
};