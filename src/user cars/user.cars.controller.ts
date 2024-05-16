import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { OwnCarService } from "./user.cars.service";
import { Protected } from "src/guards/protect.user";
import { allowedToGuard } from "src/guards/allowed.user";
import { userType } from "src/enums/user.type";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileInterceptorImage } from "src/interceptor/file.interceptor";
import { CreateUserCarsDto } from "./dto/usercars.create.dto";
import { AuthUser } from "src/decorator/current.user";
import { UserDoc } from "src/schema.factory/user.schema";
import { Roles } from "src/decorator/metadata";
import { UpdateUserCarsDto } from "./dto/usercars.update.dto";
import { ParseMongoId } from "src/pipes/validate.mogoid";
import { mongodbId } from "src/chat/chat.service";
import { UserCarsQueryDto } from "./dto/usercars.query.dto";



@Controller("own")
export class OwnCarController {
    constructor(private ownCarService: OwnCarService){};
    @Post()
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.user)
    @UseInterceptors(FileInterceptor("image"),FileInterceptorImage)
    createOwnCar(
        @Body() body:CreateUserCarsDto,
        @AuthUser() user:UserDoc
    ){
        return this.ownCarService.createMyOwnCar(body,user);
    };
    @Patch(":carId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.user)
    @UseInterceptors(FileInterceptor("image"),FileInterceptorImage)
    updateCar(
        @Body() body:UpdateUserCarsDto,
        @Param("carId",ParseMongoId) carId:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.ownCarService.updateMyOwnCar(body, carId,user);
    };
    @Delete(":carId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.user)
    deleteCar(
        @Param("carId",ParseMongoId) carId:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.ownCarService.deleteCar(carId,user);
    };
    @Get()
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.user)
    getAllMyOwnCars(
        @Query() query:UserCarsQueryDto,
        @AuthUser() user:UserDoc
    ){
        return this.ownCarService.getAllMyOwnCars(query,user);
    };
    @Get(":carId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.user)
    getCar(
        @Param("carId",ParseMongoId) carId:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.ownCarService.getCar(carId,user);
    };
};