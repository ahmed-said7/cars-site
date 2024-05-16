import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Models } from "src/enums/models";
import { ChatSchema } from "src/schema.factory/chat.schema";
import { MessageSchema } from "src/schema.factory/message.schema";
import { SchemaFactoryModule } from "src/schema.factory/schema.module";
import { UserSchema } from "src/schema.factory/user.schema";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";



@Module({
    imports:[
        MongooseModule.forFeatureAsync([
            {
                name:Models.Chat,
                useFactory:function(chatSchema:ChatSchema) {
                    return chatSchema.schema;
                },
                inject:[ChatSchema]
                ,imports:[SchemaFactoryModule]
            },
            { 
                name:Models.User,
                imports:[SchemaFactoryModule],
                inject:[UserSchema],
                useFactory:(UserSchema:UserSchema) => {
                    return UserSchema.schema;
                }
            },
            { 
                name:Models.Message,
                imports:[SchemaFactoryModule],
                inject:[MessageSchema],
                useFactory:(msgSchema:MessageSchema) => {
                    return msgSchema.schema;
                }
            }
        ])
    ],
    providers:[MessageService,{provide:"folder",useValue:"message"}],
    controllers:[MessageController]
})
export class MessageModule {};