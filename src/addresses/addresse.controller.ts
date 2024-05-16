import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { Protected } from "src/guards/protect.user";
import { AuthUser } from "src/decorator/current.user";
import { UserDoc } from "src/schema.factory/user.schema";
import { CreateAddresseDto } from "./dto/addresse.create.dto";
import { UpdateAddresseDto } from "./dto/addresse.update.dto";
import { AddresseService } from "./addresse.service";
import { mongodbId } from "src/chat/chat.service";
import { ParseMongoId } from "src/pipes/validate.mogoid";



@Controller("addresse")
export class AddresseController {
    constructor( private addresseService:AddresseService ){};
    @Post()
    @UseGuards(Protected)
    addAddresse( 
        @Body() body:CreateAddresseDto,
        @AuthUser() user:UserDoc
    ){
        return this.addresseService.addAddresse( body, user );
    };
    @Patch(":id")
    @UseGuards(Protected)
    updateAddresse( 
        @Body() body:UpdateAddresseDto ,
        @AuthUser() user:UserDoc,
        @Param( "id" ,ParseMongoId) addresseId:mongodbId
    ){
        return this.addresseService.updateAddresse(body,addresseId,user)
    };
    @Delete(":id")
    @UseGuards(Protected)
    deleteAddresse( 
        @AuthUser() user:UserDoc  ,
        @Param( "id" ,ParseMongoId) addresseId:mongodbId
    ){
        return this.addresseService.deleteAddresse(addresseId,user);
    };
}