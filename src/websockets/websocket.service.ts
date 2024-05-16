import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { mongodbId } from "src/chat/chat.service";

import { UserDoc } from "src/schema.factory/user.schema";

export interface AuthSocket extends Socket {
    user:UserDoc;
};
@Injectable()
export class WebsocketService {
    private connectedUsers=new Map<mongodbId, AuthSocket>();
    addConnectedUser(socket:AuthSocket){
        this.connectedUsers.set( socket.user._id , socket );
    };
    getConnectedUser(userId:mongodbId){
        return this.connectedUsers.get( userId );
    };
    deleteConnectedUser(userId:mongodbId){
        return this.connectedUsers.delete( userId );
    };
};