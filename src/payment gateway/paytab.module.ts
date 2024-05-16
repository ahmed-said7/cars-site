import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Models } from "src/enums/models";
import { ApiModule } from "src/filter/api.module";
import { OfferSchema } from "src/schema.factory/offer.schema";
import { RequestSchema } from "src/schema.factory/request.schema";
import { SchemaFactoryModule } from "src/schema.factory/schema.module";
import { UserSchema } from "src/schema.factory/user.schema";
import { Paytab } from "./paytabs";
import { PaytabService } from "./paytab.service";
import { PaytabController } from "./paytab.controller";


@Module({
    imports:
    [
        ApiModule,SchemaFactoryModule,
        MongooseModule.forFeatureAsync([
            {
                imports:[SchemaFactoryModule],
                inject:[OfferSchema],
                name:Models.Offer,
                useFactory:function(offerSchema:OfferSchema){
                    return offerSchema.schema;
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
                inject:[RequestSchema],
                name:Models.Request,
                useFactory:function(reqSchema:RequestSchema){
                    return reqSchema.schema;
                }
            }
        ])
    ],
    controllers : [PaytabController],
    providers : [Paytab,PaytabService]
})
export class PaytabModule {};