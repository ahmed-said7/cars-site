import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { BrandService } from "./brande.service";
import { CreateBrandDto } from "./dto/create.brand.dto";
import { Protected } from "src/guards/protect.user";
import { allowedToGuard } from "src/guards/allowed.user";
import { Roles } from "src/decorator/metadata";
import { userType } from "src/enums/user.type";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileInterceptorImage } from "src/interceptor/file.interceptor";
import { UpdateBrandDto } from "./dto/update.brand.dto";
import { ParseMongoId } from "src/pipes/validate.mogoid";
import { mongodbId } from "src/chat/chat.service";
import { QueryBrandDto } from "./dto/query.brand.dto";


@Controller("brand")
export class BrandController {
    constructor(private brandService: BrandService){};
    @Post()
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin)
    @UseInterceptors(FileInterceptor("image"),FileInterceptorImage)
    createBrand(
        @Body() body:CreateBrandDto
    ){
        return this.brandService.createBrand(body);
    };
    @Patch(":brandId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin)
    @UseInterceptors(FileInterceptor("image"),FileInterceptorImage)
    updateBrand(
        @Body() body:UpdateBrandDto,
        @Param("brandId",ParseMongoId) brandId:mongodbId
    ){
        return this.brandService.updateBrand(body, brandId);
    };
    @Delete(":brandId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin)
    deleteBrand(
        @Param("brandId",ParseMongoId) brandId:mongodbId
    ){
        return this.brandService.deleteBrand(brandId);
    };
    @Get()
    getBrands(
        @Query() query:QueryBrandDto
    ){
        return this.brandService.getAllBrands(query);
    };
    @Get(":brandId")
    getBrand(
        @Param("brandId",ParseMongoId) brandId:mongodbId
    ){
        return this.brandService.getBrand(brandId);
    };
};