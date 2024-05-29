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
import { OrderSchema } from "src/schema.factory/order.schema";
import { CarModelSchema } from "src/schema.factory/car.model.schema";
import { CarBrandSchema } from "src/schema.factory/car.brand.schema";
import { SpareSchema } from "src/schema.factory/spare.schema";


@Module({
    imports:
    [
        ApiModule,SchemaFactoryModule,
        MongooseModule.forFeatureAsync([
            {
                imports:[SchemaFactoryModule],
                inject:[SpareSchema],
                name:Models.Spare,
                useFactory:function(spare:SpareSchema){
                    return spare.schema;
                }
            },
            {
                imports:[SchemaFactoryModule],
                inject:[CarBrandSchema],
                name:Models.Brand,
                useFactory:function(brand:CarBrandSchema){
                    return brand.schema;
                }
            },
            {
                imports:[SchemaFactoryModule],
                inject:[CarModelSchema],
                name:Models.CarModel,
                useFactory:function(CarModel:CarModelSchema){
                    return CarModel.schema;
                }
            },
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
            },
            {
                imports:[SchemaFactoryModule],
                inject:[OrderSchema],
                name:Models.Order,
                useFactory:function(orderSchema:OrderSchema){
                    return orderSchema.schema;
                }
            }
        ])
    ],
    controllers : [PaytabController],
    providers : [Paytab,PaytabService]
})
export class PaytabModule {};