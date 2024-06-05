import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Models } from "src/enums/models";
import { ApiModule } from "src/filter/api.module";
import { RequestSchema } from "src/schema.factory/request.schema";
import { SchemaFactoryModule } from "src/schema.factory/schema.module";
import { UserSchema } from "src/schema.factory/user.schema";
import { OfferSchema } from "src/schema.factory/offer.schema";
import { OfferService } from "./offer.service";
import { OfferController } from "./offer.controller";
import { CouponSchema } from "src/schema.factory/coupon.schema";



@Module({
    imports:
    [
        ApiModule,SchemaFactoryModule,
        MongooseModule.forFeatureAsync([
            {
                imports:[SchemaFactoryModule],
                inject:[OfferSchema],
                name:Models.Offer,
                useFactory:function(OfferSchema:OfferSchema){
                    return OfferSchema.schema;
                }
            },
            {
                imports:[SchemaFactoryModule],
                inject:[UserSchema],
                name:Models.User,
                useFactory:function(userSchema:UserSchema){
                    return userSchema.schema;
                }
            },
            {
                imports:[SchemaFactoryModule],
                inject:[CouponSchema],
                name:Models.Coupon,
                useFactory:function(couponSchema:CouponSchema){
                    return couponSchema.schema;
                }
            },
            {
                imports:[SchemaFactoryModule],
                inject:[RequestSchema],
                name:Models.Request,
                useFactory:function(reqSchema:RequestSchema){
                    return reqSchema.schema;
                }
            }
        ])
    ],
    controllers : [OfferController],
    providers : [{provide:"folder",useValue:"offer"},OfferService]
})
export class OfferModule {};