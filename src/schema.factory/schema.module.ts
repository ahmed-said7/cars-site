import { Module } from "@nestjs/common";
import { UserSchema } from "./user.schema";
import { ChatSchema } from "./chat.schema";
import { MessageSchema } from "./message.schema";
import { ConfigModule } from "@nestjs/config";
import { CarBrandSchema } from "./car.brand.schema";
import { CarModelSchema } from "./car.model.schema";
import { OwnCarsSchema } from "./user.cars.schema";
import { ReviewSchema } from "./review.schema";
import { SpareSchema } from "./spare.schema";
import { RequestSchema } from "./request.schema";
import { OfferSchema } from "./offer.schema";
import { OrderSchema } from "./order.schema";
import { CouponSchema } from "./coupon.schema";



@Module({
    imports:[
        ConfigModule.forRoot()
    ],
    providers:[
        OfferSchema,
        UserSchema,ChatSchema,MessageSchema,CarBrandSchema,
        CarModelSchema,OwnCarsSchema,ReviewSchema,SpareSchema,RequestSchema,
        OrderSchema,CouponSchema
    ],
    exports:[
        UserSchema,ChatSchema,MessageSchema,CarBrandSchema,CarModelSchema,
        OwnCarsSchema,ReviewSchema,SpareSchema,RequestSchema,
        OfferSchema,OrderSchema,CouponSchema
    ]
})

export class SchemaFactoryModule {};