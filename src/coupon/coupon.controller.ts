import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { CouponServices } from "./coupon.service";
import { Roles } from "src/decorator/metadata";
import { userType } from "src/enums/user.type";
import { allowedToGuard } from "src/guards/allowed.user";
import { Protected } from "src/guards/protect.user";
import { UpdateCouponDto } from "./dto/update.coupon.dto";
import { QueryCouponDto } from "./dto/query.coupon.dto";
import { ParseMongoId } from "src/pipes/validate.mogoid";
import { mongodbId } from "src/chat/chat.service";
import { CreateCouponDto } from "./dto/create.coupon.dto";


@Controller('coupon')
export class CouponController {
    constructor(private couponService: CouponServices){};
    @Get(":couponId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin,userType.user)
    getCoupon( @Param('couponId',ParseMongoId) couponId:mongodbId ){
        return this.couponService.getCoupon(couponId);
    };

    @Get()
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin,userType.user)
    getCoupons(@Query() query : QueryCouponDto ){
        return this.couponService.getAllCoupons(query)
    };
    
    @Patch(':couponId')
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin)
    updateCoupon(
        @Param('couponId',ParseMongoId) couponId:mongodbId,
        @Body() body:UpdateCouponDto
        ){
        return this.couponService.updateCoupon(couponId,body);
    };
    
    @Delete(":couponId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin)
    deleteCoupon(@Param('couponId') couponId:ObjectId){
        return this.couponService.deleteCoupon(couponId);
    };

    @Post()
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin)
    createCoupon(@Body() body:CreateCouponDto){
        return this.couponService.createCoupon(body);
    };
};