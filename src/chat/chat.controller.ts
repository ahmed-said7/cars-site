import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { ChatService, mongodbId } from "./chat.service";
import { CreateChatDto } from "./dto/create.chat";
import { AuthUser } from "src/decorator/current.user";
import { UserDoc } from "src/schema.factory/user.schema";
import { Protected } from "src/guards/protect.user";

import { ParseMongoId } from "src/pipes/validate.mogoid";
import { UpdateChatDto } from "./dto/update.chat";
import { FileInterceptorImage } from "src/interceptor/file.interceptor";
import { FileInterceptor } from "@nestjs/platform-express";


@Controller("chat")
@UseGuards(Protected)
export class ChatController {
    constructor(private chatService: ChatService){};
    @Post()
    @UseInterceptors(FileInterceptor("image"),FileInterceptorImage)
    createChat(
        @Body() body:CreateChatDto,
        @AuthUser() user:UserDoc
    ){
        return this.chatService.createChat(body, user);
    };

    @Get()
    getUserChats(
        @AuthUser() user:UserDoc
    ){
        return this.chatService.getChats(user);
    };

    // @Delete(":id")
    // deleteChat(
    //     @Param("id",ParseMongoId) id:mongodbId,
    //     @AuthUser() user:UserDoc
    // ){
    //     return this.chatService.deleteChat(id, user)
    // };

    @Get(":id")
    getChatMembers(
        @Param("id",ParseMongoId) id:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.chatService.getChatMemebers(id, user)
    };

    @Patch(":id")
    @UseInterceptors(FileInterceptor("image"),FileInterceptorImage)
    updateChat(
        @Body() body:UpdateChatDto,
        @Param("id",ParseMongoId) id:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.chatService.updateChat(id,body,user);
    };

}; 