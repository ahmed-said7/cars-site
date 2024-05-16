import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Models } from "src/enums/models";
import { SchemaFactoryModule } from "src/schema.factory/schema.module";
import { UserSchema } from "src/schema.factory/user.schema";
import { ChatSchema } from "src/schema.factory/chat.schema";


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
            }
        ])
    ],
    controllers:[ChatController],
    providers:[ChatService,{provide:"folder",useValue:"chat"}]
})
export class ChatModule {};