import { Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { Protected } from "src/guards/protect.user";
import { allowedToGuard } from "src/guards/allowed.user";
import { userType } from "src/enums/user.type";
import { Roles } from "src/decorator/metadata";
import { ParseMongoId } from "src/pipes/validate.mogoid";
import { mongodbId } from "src/chat/chat.service";
import { UserDoc } from "src/schema.factory/user.schema";
import { AuthUser } from "src/decorator/current.user";
import { QueryOrderDto } from "./dto/quey.order.dto";

@Controller("order")
export class OrderController {
    constructor(public orderSrv: OrderService){};
    @Patch(":orderId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.user)
    updateDeliveredOrder(
        @Param("orderId",ParseMongoId) offerId:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.orderSrv.userDeliveredOrder(offerId,user);
    };
    @Delete(":orderId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin)
    deleteOrder(
        @Param("orderId",ParseMongoId) orderId:mongodbId
    ){
        return this.orderSrv.deleteOrder(orderId);
    };
    @Get()
    @UseGuards(Protected)
    getOrders(
        @Query() query:QueryOrderDto,
        @AuthUser() user:UserDoc
    ){
        return this.orderSrv.getOrders(query,user);
    };
    @Get(":orderId")
    @UseGuards(Protected)
    getOrder(
        @Param("orderId",ParseMongoId) orderId:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.orderSrv.getOneOrder(orderId,user);
    };
};