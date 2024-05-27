import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Models } from "src/enums/models";
import { SchemaFactoryModule } from "src/schema.factory/schema.module";
import { UserSchema } from "src/schema.factory/user.schema";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { CarBrandSchema } from "src/schema.factory/car.brand.schema";
import { ApiModule } from "src/filter/api.module";
import { mailerModule } from "src/nodemailer/mailer.module";
import { AuthController } from "./auth.controller";
import { AdminController } from "./admin.controller";

@Module({
    imports:[
        ApiModule,mailerModule,
        MongooseModule.forFeatureAsync([
            { 
                name:Models.User,
                imports:[SchemaFactoryModule],
                inject:[UserSchema],
                useFactory:(UserSchema:UserSchema) => {
                    return UserSchema.schema;
                }
            },
            { 
                name:Models.Brand,
                imports:[SchemaFactoryModule],
                inject:[CarBrandSchema],
                useFactory:(carSchema:CarBrandSchema) => {
                    return carSchema.schema;
                }
            }
        ])
    ],
    providers:[UserService,{provide:"folder",useValue:"user"}],
    controllers:[UserController,AuthController,AdminController]
})
export class UserModule {};