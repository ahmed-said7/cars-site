import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { mongodbId } from "src/chat/chat.service";
import { Models } from "src/enums/models";
import { CrudService } from "src/filter/crud.service";
import { OrderDoc } from "src/schema.factory/order.schema";
import { UserDoc } from "src/schema.factory/user.schema";
import { QueryOrderDto } from "./dto/quey.order.dto";

@Injectable()
export class OrderService {

    constructor( 
        @InjectModel(Models.Order) private orderModel:Model<OrderDoc>,
        private crudSrv:CrudService<OrderDoc,QueryOrderDto>
    ){};


    async userDeliveredOrder(orderId:mongodbId,user:UserDoc){
        let order=await this.orderModel.findOne(
            { _id:orderId , user:user._id }
        ).populate( this.populationOptions() );
        if(!order){
            throw new HttpException("No order found",400);
        };
        order.deliveredAt=new Date();
        order.delivered=true;
        await order.save();
        return { status: "order updated to be delivered" , order };
    };


    async deleteOrder(orderId:mongodbId){
        const order=await this.orderModel.findByIdAndDelete(orderId);
        if(!order){
            throw new HttpException("Order not found",400);
        };
        return { status:"order deleted" };
    };


    async getOneOrder( orderId:mongodbId , user:UserDoc){
        let order=await this.orderModel.findOne(
            { _id:orderId }
        );
        if(!order){
            throw new HttpException("No order found",400);
        };
        if(user.role == "trader" && user._id.toString() != order.trader.toString() ){
            throw new HttpException("you are not order trader",400);
        };
        if(user.role == "user" && user._id.toString() != order.user.toString() ){
            throw new HttpException("you are not order user",400);
        };
        order=await order.populate( this.populationOptions() );
        return { order };
    };


    private populationOptions(){
        return [ 
            { 
                path:"request" , 
                populate : [ 
                    { path:"brand",model:Models.Brand }, 
                    { path:"carmodel",model:Models.CarModel }
                ],
                select:"-user"
            },
            { 
                path:"user" , select:"name image" 
            }
            ,{ 
                path:"trader" , select:"name image" 
            },
            {path:"offer",select:"-trader"}
        ];
    };


    async getOrders(query:QueryOrderDto,user:UserDoc){
        let obj={};
        if( user.role == "trader" ){
            obj = { trader : user._id };
        };
        if( user.role == "user" ){
            obj = { user : user._id };
        };
        return this.crudSrv.getAllDocs(
            this.orderModel.find() , query , {  ... obj },
            this.populationOptions()
        );
    };
};