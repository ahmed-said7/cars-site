import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { mongodbId } from "src/chat/chat.service";
import { Models } from "src/enums/models";
import { ChatDoc } from "src/schema.factory/chat.schema";
import { MessageDoc } from "src/schema.factory/message.schema";
import { UserDoc } from "src/schema.factory/user.schema";

interface CreateMsg {
    content?: string;
    image?: string;
    chat:mongodbId;
    user?:mongodbId;
};

interface UpdateMsg {
    content?: string;
    image?: string;
};

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Models.Chat) private chatModel: Model<ChatDoc>,
        @InjectModel(Models.Message) private msgModel: Model<MessageDoc>
    ){};
    async createMessage(body:CreateMsg,user:UserDoc){
        if( !body.content && !body.image ){
            throw new HttpException("content or image is required",400);
        };
        const chat=await this.validateChat(body.chat,user);
        body.user=user._id;
        const message = await this.msgModel.create(body);
        chat.lastMessage=message._id;
        await chat.save();
        return { message };
    };
    async deleteMessage(messageId:mongodbId,user:UserDoc){
        const message = await this.msgModel.findById(messageId);
        if( !message ){
            throw new HttpException("message not found",400);
        };
        if( message.user.toString() != user._id.toString() ){
            throw new HttpException("you are not message sender",400)
        };
        const chat=await this.chatModel.findOne({ _id : message.chat });
        if( chat?.lastMessage?.toString() == messageId.toString() ){
            chat.lastMessage=(await this.msgModel.find({
                chat: message.chat
            }).sort("-createdAt"))[1]._id;
        };
        await message.deleteOne();
        return { status:"deleted" , message };
    };
    async updateMessage(messageId:mongodbId,body:UpdateMsg,user:UserDoc){
        const message = await this.msgModel.findById(messageId);
        if( !message ){
            throw new HttpException("message not found",400);
        };
        if( message.user.toString() != user._id.toString() ){
            throw new HttpException("you are not message sender",400)
        };
        const updated=await this.msgModel.findByIdAndUpdate(messageId,body,{new:true});
        return { status:"updated" , message:updated };
    };
    private async validateChat(chatId:mongodbId,user:UserDoc){
        const chat=await this.chatModel.findById(chatId);
        if(!chat){
            throw new HttpException("chat not found",400);
        };
        if( 
            chat.user.toString() != user._id.toString() 
            && 
            chat.admin.toString() != user._id.toString()
        ){
            throw new HttpException("you are not chat member",400);
        };
        return chat;
    };
    async getChatMessages(chatId:mongodbId,user:UserDoc){
        await this.validateChat(chatId,user);
        const messages = await this.msgModel.find({
            chat: chatId
        })
        .sort("-createdAt")
        .populate("user");
        return { messages };
    };
};