import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Models } from "src/enums/models";
import { SchemaFactoryModule } from "src/schema.factory/schema.module";
import { UserSchema } from "src/schema.factory/user.schema";
import { ApiModule } from "src/filter/api.module";
import { QuestionService } from "./question.service";
import { QuestionController } from "./question.controller";
import { ContactSchema } from "src/schema.factory/contact.schema";
import { QuestionSchema } from "src/schema.factory/question.schema";


@Module({
    imports:[
        ApiModule,
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
                name:Models.Contact,
                imports:[SchemaFactoryModule],
                inject:[ContactSchema],
                useFactory:(contactSchema:ContactSchema) => {
                    return contactSchema.schema;
                }
            },
            { 
                name:Models.Question,
                imports:[SchemaFactoryModule],
                inject:[QuestionSchema],
                useFactory:(questionSchema:QuestionSchema) => {
                    return questionSchema.schema;
                }
            }
        ])
    ],
    providers:[QuestionService],
    controllers:[QuestionController]
})
export class QuestionModule {};