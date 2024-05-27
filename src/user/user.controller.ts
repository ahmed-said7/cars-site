import { Body, Controller, Delete, Get, Patch, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { Protected } from "src/guards/protect.user";
import { UpdatePasswordDto } from "./dto/update.password.dto";
import { AuthUser } from "src/decorator/current.user";
import { UserDoc } from "src/schema.factory/user.schema";
import {  UpdateUserDto} from "./dto/update.user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileInterceptorImage } from "src/interceptor/file.interceptor";


@Controller("user")
export class UserController {
    constructor( private userService:UserService ){};
    @Patch("pass")
    @UseGuards(Protected)
    updatePassword( @Body() body:UpdatePasswordDto , @AuthUser() user:UserDoc  ){
        return this.userService.updatepassword(body, user);
    };

    @Get("verify")
    @UseGuards(Protected)
    sendVerificationToEmail( @AuthUser() user:UserDoc  ){
        return this.userService.createEmailVerificationCode(user);
    };

    @Delete("user")
    @UseGuards(Protected)
    deleteUser( @AuthUser() user:UserDoc  ){
        return this.userService.deleteLoggedUser(user);
    };
    @Get("user")
    @UseGuards(Protected)
    getUser( @AuthUser() user:UserDoc  ){
        return this.userService.getLoggedUser(user);
    };
    @Patch("user")
    @UseGuards(Protected)
    @UseInterceptors(FileInterceptor("image"),FileInterceptorImage)
    updateUser( @AuthUser() user:UserDoc,@Body() body:UpdateUserDto  ){
        return this.userService.updateUser(body,user);
    };
};