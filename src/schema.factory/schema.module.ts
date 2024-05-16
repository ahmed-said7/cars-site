import { Module } from "@nestjs/common";
import { UserSchema } from "./user.schema";
import { ChatSchema } from "./chat.schema";
import { MessageSchema } from "./message.schema";
import { ConfigModule } from "@nestjs/config";
import { CarBrandSchema } from "./car.brand.schema";
import { CarModelSchema } from "./car.model.schema";
import { OwnCarsSchema } from "./user.cars.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { Models } from "src/enums/models";
import { ReviewSchema } from "./review.schema";
import { SpareSchema } from "./spare.schema";
import { RequestSchema } from "./request.schema";



@Module({
    imports:[
        ConfigModule.forRoot()
    ],
    providers:[
        UserSchema,ChatSchema,MessageSchema,CarBrandSchema,
        CarModelSchema,OwnCarsSchema,ReviewSchema,SpareSchema,RequestSchema
    ],
    exports:[
        UserSchema,ChatSchema,MessageSchema,CarBrandSchema,CarModelSchema,
        OwnCarsSchema,ReviewSchema,SpareSchema,RequestSchema
    ]
})

export class SchemaFactoryModule {};