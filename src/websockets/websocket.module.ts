import { Module } from "@nestjs/common";
import { WebSocketEvents } from "./websocket.gateway";
import { WebsocketService } from "./websocket.service";
import { Models } from "src/enums/models";
import { SchemaFactoryModule } from "src/schema.factory/schema.module";
import { UserSchema } from "src/schema.factory/user.schema";
import { ChatSchema } from "src/schema.factory/chat.schema";
import { MongooseModule } from "@nestjs/mongoose";



@Module({
    imports:[
        MongooseModule.forFeatureAsync([
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
    providers:[WebSocketEvents,WebsocketService]
})
export class SocketModule {};