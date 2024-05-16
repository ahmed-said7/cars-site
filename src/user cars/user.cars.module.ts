import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Models } from "src/enums/models";
import { ApiModule } from "src/filter/api.module";
import { CarBrandSchema } from "src/schema.factory/car.brand.schema";
import { CarModelSchema } from "src/schema.factory/car.model.schema";
import { SchemaFactoryModule } from "src/schema.factory/schema.module";
import { UserSchema } from "src/schema.factory/user.schema";
import { OwnCarsSchema } from "src/schema.factory/user.cars.schema";
import { OwnCarService } from "./user.cars.service";
import { OwnCarController } from "./user.cars.controller";


@Module({
    imports:
    [
        ApiModule,SchemaFactoryModule,
        MongooseModule.forFeatureAsync([
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
                inject:[UserSchema],
                name:Models.User,
                useFactory:function(userSchema:UserSchema){
                    return userSchema.schema;
                }
            },
            {
                imports:[SchemaFactoryModule],
                inject:[OwnCarsSchema],
                name:Models.userCars,
                useFactory:function(OwnCarsSchema:OwnCarsSchema){
                    return OwnCarsSchema.schema;
                }
            }
        ])
    ],
    controllers : [OwnCarController],
    providers : [OwnCarService,{provide:"folder",useValue:"car"}]
})
export class OwnCarsModule {};