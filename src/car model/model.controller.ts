import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { Protected } from "src/guards/protect.user";
import { allowedToGuard } from "src/guards/allowed.user";
import { Roles } from "src/decorator/metadata";
import { userType } from "src/enums/user.type";
import { ParseMongoId } from "src/pipes/validate.mogoid";
import { mongodbId } from "src/chat/chat.service";
import { BrandModelService } from "./model.service";
import { CreateCarModelDto } from "./dto/car.model.create.dto";
import { UpdateCarModelDto } from "./dto/update.model.dto";
import { QueryCarModelDto } from "./dto/car.model.query.dto";



@Controller("model")
export class BrandModelController {
    constructor(private modelService:BrandModelService ){};
    @Post()
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin)
    createModel(
        @Body() body:CreateCarModelDto
    ){
        return this.modelService.createModel(body);
    };
    @Patch(":modelId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin)
    updateModel(
        @Body() body:UpdateCarModelDto,
        @Param("modelId",ParseMongoId) modelId:mongodbId
    ){
        return this.modelService.updateModel(body, modelId);
    };
    @Delete(":modelId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin)
    deleteModel(
        @Param("modelId",ParseMongoId) modelId:mongodbId
    ){
        return this.modelService.deleteModel(modelId);
    };
    @Get("brand/:brandId")
    getBrandModels(
        @Param("brandId",ParseMongoId) brandId:mongodbId
    ){
        return this.modelService.getBrandModels(brandId);
    };
    @Get()
    getModels(
        @Query() query:QueryCarModelDto
    ){
        return this.modelService.getAllModels(query);
    };
    @Get(":modelId")
    getModel(
        @Param("modelId",ParseMongoId) modelId:mongodbId
    ){
        return this.modelService.getBrandModel(modelId);
    };
};