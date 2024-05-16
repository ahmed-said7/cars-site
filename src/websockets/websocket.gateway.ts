import { 
    ConnectedSocket, MessageBody, OnGatewayConnection, 
    OnGatewayDisconnect, SubscribeMessage, 
    WebSocketGateway, WebSocketServer 
} from "@nestjs/websockets";
import { JwtPayload } from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { Model } from "mongoose";
import { UserDoc } from "src/schema.factory/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Models } from "src/enums/models";
import { AuthSocket, WebsocketService } from "./websocket.service";


interface Payload extends jwt.JwtPayload {
    userId:string;
};

@WebSocketGateway()
export class WebSocketEvents implements OnGatewayConnection , OnGatewayDisconnect {
    constructor(
        private config:ConfigService,
        @InjectModel(Models.User) private UserModel:Model<UserDoc>,
        private SocketService:WebsocketService
    ){};
    async handleConnection(client: AuthSocket, ...args: any[]) {
        let token:string;
        const authorization=client.handshake.headers.authorization;
        if( 
            authorization 
            && authorization.startsWith("Bearer") 
        ){
            token=authorization.split(" ")[1];
        };
        if( !token ){
            // client.send("no token available , please provide a token",()=>{
            //     client.disconnect();
            // });
            client.disconnect();
        };
        let decoded:Payload|null=null;
        try{
            decoded=jwt.verify( token , this.config.get<string>("secret") ) as Payload;
        }catch(e){
            client.disconnect();
        };
        if(!decoded) client.disconnect();
        const user=await this.UserModel.findById(decoded?.userId);
        if(!user){
            client.disconnect();
        };
        if(user.passwordChangedAt){
            const stamps=new Date(user.passwordChangedAt).getTime() / 1000;
            if( stamps > decoded.iat ){
                client.disconnect();
            };
        };
        client.user=user;
        this.SocketService.addConnectedUser(client);
    };
    async handleDisconnect(client: AuthSocket) {
        if( client.user ) {
            this.SocketService.deleteConnectedUser(client.user._id);
            // await this.UserModel.findByIdAndUpdate(client.user._id,{
            //     lastSeen:new Date()
            // });
        };
    };
    @WebSocketServer()
    private server:Server;
    
    // @SubscribeMessage("onTypingStart")
    // clientJoinedServer(
    //     @MessageBody() body : { chatId:mongodbId },
    //     @ConnectedSocket() socket : AuthSocket
    // ){};

    // @OnEvent("message.created")
    // messageCreated(message:MessageDoc){};

};