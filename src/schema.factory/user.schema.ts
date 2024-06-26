import { Schema,Document, Query } from "mongoose";
import * as bcryptjs from "bcryptjs";
import { mongodbId } from "src/chat/chat.service";
import { Injectable } from "@nestjs/common";
import { Models } from "src/enums/models";
import { BrandDoc } from "./car.brand.schema";


@Injectable()
export class UserSchema {
    schema=new Schema({
        name:{
            type:String,
            required:true,
            trim:true,
            minlength:4
        },
        image:String,
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true
        },
        password:{
            type:String,
            required:true
            ,minlength:6
        },
        role:{
            type:String,
            enum:["user","admin","trader"],
            default:"user"
        },
        tradingType:{
            type:String,
            enum:["new","used"]
        },
        mobile:String,
        emailVertified:{type:Boolean,default:false},
        emailVerifiedExpired:Date,
        emailVerifiedCode:String,
        passwordResetCode:String,
        passwordResetCodeExpires:Date,
        passwordResetCodeVertified:Boolean,
        tradingBrand:[{ type:Schema.Types.ObjectId , ref:Models.Brand }],
        coupons:[{ type:Schema.Types.ObjectId , ref:Models.Coupon }],
        ratingQuantity:{type:Number,default:0},
        averageRating:{type:Number,default:0},
        passwordChangedAt:Date,
        active:Boolean,
        allowTrading:{type:Boolean,default:false},
        addresses:[{
            code:Number,
            country:String,
            city:String,
            quarter:String
        }]
        },{
            timestamps:true
        }
    );
    constructor(){
        this.schema.pre("save",async function(next){
            if(this.isModified("password")){
                this.password=await bcryptjs.hash(this.password,10);
            };
            return next();
        });
        this.schema.pre< Query< UserDoc|UserDoc[], UserDoc > >(/^find/,function(){
            this.populate("tradingBrand");
        });
        this.schema.index({ name:"text" });
        this.schema.post("init",function(){
            if(this.image){
                this.image=`${process.env.url}/user/${this.image}`;
            }
        });
        this.schema.post("save",function(){
            if(this.image){
                this.image=`${process.env.url}/user/${this.image}`;
            }
        });
    };
};

export interface UserDoc extends Document {
    name:string;
    email:string;
    image:string;
    password:string;
    role:string;
    passwordChangedAt?:Date;
    tradingType?:string;
    emailVertified?:boolean;
    emailVerifiedExpired?:Date;
    emailVerifiedCode?:string;
    passwordResetCode?:string;
    passwordResetCodeExpires?:Date;
    passwordResetCodeVertified?:boolean;
    addresses:{
        _id:mongodbId;
        postalCode:number;
        details:string;
        city:string;
        street:string;
        mobile:string;
    }[];
    tradingBrand:BrandDoc[];
    allowTrading:boolean;
    active:boolean;
    coupons:mongodbId[];
};