import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Models } from "src/enums/models";
import { ChatSchema } from "src/schema.factory/chat.schema";
import { MessageSchema } from "src/schema.factory/message.schema";
import { SchemaFactoryModule } from "src/schema.factory/schema.module";
import { UserSchema } from "src/schema.factory/user.schema";
import { CouponServices } from "./coupon.service";
import { CouponController } from "./coupon.controller";
import { CouponSchema } from "src/schema.factory/coupon.schema";
import { ApiModule } from "src/filter/api.module";



@Module({
    imports:[
        ApiModule,
        MongooseModule.forFeatureAsync([
            {
                name:Models.Coupon,
                useFactory:function(couponSchema:CouponSchema) {
                    return couponSchema.schema;
                },
                inject:[CouponSchema]
                ,imports:[SchemaFactoryModule]
            },
            { 
                name:Models.User,
                imports:[SchemaFactoryModule],
                inject:[UserSchema],
                useFactory:(UserSchema:UserSchema) => {
                    return UserSchema.schema;
                }
            }
        ])
    ],
    providers:[CouponServices],
    controllers:[CouponController]
})
export class CouponModule {};