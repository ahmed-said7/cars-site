import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Models } from "src/enums/models";
import { ChatDoc } from "src/schema.factory/chat.schema";
import { UserDoc } from "src/schema.factory/user.schema";

interface CreateChat {
    name: string;
    image: string;
    user: mongodbId;
    admin: mongodbId;
};
interface UpdateChat {
    name?: string;
    image?: string;
};

export type mongodbId=mongoose.Schema.Types.ObjectId;

@Injectable()
export class ChatService {
    constructor( 
        @InjectModel(Models.Chat) private chatModel:Model<ChatDoc>,
        @InjectModel(Models.User) private userModel:Model<UserDoc>
    ){};
    async createChat(body:CreateChat,user:UserDoc){
        body.admin=user._id;
        const userExist=await this.userModel.findOne({ _id:body.user });
        if(!userExist){
            throw new HttpException("user not found",400);
        };
        const chatExist=await this.chatModel.findOne({
            $or:[
                { user: body.admin , admin:body.user },
                { admin: body.admin , user:body.user }
            ]
        });
        if(chatExist){
            throw new HttpException("chat already exists",400);
        };
        const chat=await this.chatModel.create(body);
        return { chat };
    };
    async updateChat(chatId:mongodbId,body:UpdateChat,user:UserDoc){
        const chatExist=await this.chatModel.findOne({
            $or:[
                { _id:chatId, user: user._id  },
                { _id:chatId, admin: user._id }
            ]
        });
        if(!chatExist){
            throw new HttpException("chat not found",400);
        };
        const chat=await this.chatModel.findByIdAndUpdate( chatId,body,{new:true} );
        return { chat };
    };
    async getChats(user:UserDoc){
        const chats=await this.chatModel.find({
            $or:[
                { user: user._id  },
                { admin: user._id }
            ]
        }).populate({
            path:"lastMessage",
            populate:{
                path:"user",
                model:Models.User
            }
        });
        return { chats };
    };
    // async deleteChat(chatId:mongodbId,user:UserDoc){
    //     const chatExist=await this.chatModel.findOne({
    //         $or:[
    //             { _id:chatId , user: user._id  },
    //             { _id:chatId , admin: user._id }
    //         ]
    //     });
    //     if(!chatExist){
    //         throw new HttpException("chat not found",400);
    //     };
    //     await chatExist.deleteOne();
    //     return { status:"deleted" };
    // };
    async getChatMemebers(chatId:mongodbId,user:UserDoc){
        const chat=await this.chatModel.findOne({
            $or:[
                { _id:chatId , user: user._id  },
                { _id:chatId , admin: user._id }
            ]
        }).populate(["user","admin"]);
        if(!chat){
            throw new HttpException("No chat found",400);
        }
        return { admin:chat.admin , user:chat.user };
    };
};